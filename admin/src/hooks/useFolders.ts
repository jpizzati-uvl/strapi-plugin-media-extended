import * as React from 'react';
import { useQuery } from 'react-query';
import { useNotification } from '@strapi/admin/strapi-admin';
import { useNotifyAT } from '@strapi/design-system';
import { stringify } from 'qs';
import { useIntl } from 'react-intl';
import { useMediaLibraryApi, Query, Folder } from '../services/api';
import { PLUGIN_ID } from '../pluginId';

interface UseFoldersOptions {
  enabled?: boolean;
  query?: Query;
}

export const useFolders = ({ enabled = true, query = {} }: UseFoldersOptions = {}) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { notifyStatus } = useNotifyAT();
  const { folder, _q, ...paramsExceptFolderAndQ } = query;
  const { getFolders } = useMediaLibraryApi();

  let params: Query;

  if (_q) {
    params = {
      ...paramsExceptFolderAndQ,
      pageSize: 100, // Changed from -1 to 100 for Strapi v5 compatibility
      _q,
    };
  } else {
    params = {
      ...paramsExceptFolderAndQ,
      pageSize: 100, // Changed from -1 to 100 for Strapi v5 compatibility
      filters: {
        $and: [
          ...(paramsExceptFolderAndQ?.filters?.$and ?? []),
          {
            parent: {
              id: folder ?? {
                $null: true,
              },
            },
          },
        ],
      },
    };
  }

  const { data, error, isLoading } = useQuery<Folder[], Error>(
    [PLUGIN_ID, 'folders', stringify(params)],
    async () => {
      const data = await getFolders(params);
      return data;
    },
    {
      enabled,
      staleTime: 0,
      cacheTime: 0,
      onError() {
        toggleNotification({
          type: 'danger',
          message: formatMessage({ id: 'notification.error', defaultMessage: 'An error occurred' }),
        });
      },
    }
  );

  React.useEffect(() => {
    if (data) {
      notifyStatus(
        formatMessage({
          id: 'list.asset.at.finished',
          defaultMessage: 'The folders have finished loading.',
        })
      );
    }
  }, [data, formatMessage, notifyStatus]);

  return { data, error, isLoading };
};