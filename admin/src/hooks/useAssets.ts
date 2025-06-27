import * as React from 'react';
import { useQuery } from 'react-query';
import { useNotification } from '@strapi/admin/strapi-admin';
import { useNotifyAT } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useMediaLibraryApi, Query, GetFilesResponse } from '../services/api';
import { PLUGIN_ID } from '../pluginId';

interface UseAssetsOptions {
  skipWhen?: boolean;
  query?: Query;
}

export const useAssets = ({ skipWhen = false, query = {} }: UseAssetsOptions = {}) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { notifyStatus } = useNotifyAT();
  const { getFiles } = useMediaLibraryApi();
  const { folderPath, _q, ...paramsExceptFolderAndQ } = query;

  let params: Query;

  if (_q) {
    params = {
      ...paramsExceptFolderAndQ,
      _q: encodeURIComponent(_q),
    };
  } else {
    params = {
      ...paramsExceptFolderAndQ,
      filters: {
        $and: [
          ...(paramsExceptFolderAndQ?.filters?.$and ?? []),
          {
            folderPath: { $eq: folderPath ?? '/' },
          },
        ],
      },
    };
  }

  const { data, error, isLoading } = useQuery<GetFilesResponse, Error>(
    [PLUGIN_ID, 'assets', params],
    async () => {
      const data = await getFiles(params);
      return data;
    },
    {
      enabled: !skipWhen,
      staleTime: 0,
      cacheTime: 0,
      select(data: GetFilesResponse) {
        if (data?.results && Array.isArray(data.results)) {
          return {
            ...data,
            results: data.results
              .filter((asset: any) => asset.name)
              .map((asset: any) => ({
                ...asset,
                mime: asset.mime ?? '',
                ext: asset.ext ?? '',
              })),
          };
        }
        return data;
      },
    }
  );

  React.useEffect(() => {
    if (data) {
      notifyStatus(
        formatMessage({
          id: 'list.asset.at.finished',
          defaultMessage: 'The assets have finished loading.',
        })
      );
    }
  }, [data, formatMessage, notifyStatus]);

  React.useEffect(() => {
    if (error) {
      toggleNotification({
        type: 'danger',
        message: formatMessage({ id: 'notification.error', defaultMessage: 'An error occurred' }),
      });
    }
  }, [error, formatMessage, toggleNotification]);

  return { data, error, isLoading };
};