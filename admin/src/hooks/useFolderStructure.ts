import * as React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useMediaLibraryApi } from '../services/api';
import { getTrad } from '../utils/getTrad';
import { PLUGIN_ID } from '../pluginId';
import type { OptionSelectTree } from '../components/MediaExtendedInput/SelectTree';


// Transform the folder structure from API to SelectTree format
const transformFolderStructure = (folders: any): OptionSelectTree[] => {
  // Handle both array and object responses
  const folderArray = Array.isArray(folders) ? folders : folders?.data || [];
  
  return folderArray.map((folder: any) => ({
    value: folder.id,
    label: folder.name,
    children: folder.children ? transformFolderStructure(folder.children) : [],
  }));
};

export const useFolderStructure = ({ enabled = true } = {}) => {
  const { formatMessage } = useIntl();
  const { getFolderStructure } = useMediaLibraryApi();

  const { data: folderStructure, isLoading, error } = useQuery(
    [PLUGIN_ID, 'folder-structure'],
    async () => {
      const data = await getFolderStructure();
      return data;
    },
    {
      enabled,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const data = React.useMemo(() => {
    if (!folderStructure) return undefined;

    const transformedFolders = transformFolderStructure(folderStructure);
    
    return [
      {
        value: null,
        label: formatMessage({
          id: getTrad('form.input.label.folder-location-default-label'),
          defaultMessage: 'Media Library',
        }),
        children: transformedFolders,
      },
    ];
  }, [folderStructure, formatMessage]);

  return { data, error, isLoading };
};