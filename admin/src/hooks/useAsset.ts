import { useQuery } from 'react-query';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { PLUGIN_ID } from '../pluginId';
import type { File } from '../utils/getAllowedFiles';

export const useAsset = (id: string | number | undefined, options?: { enabled?: boolean }) => {
  const { get } = useFetchClient();

  return useQuery<File, Error>(
    [PLUGIN_ID, 'asset', id],
    async () => {
      if (!id) throw new Error('Asset ID is required');
      
      // Fetch single asset with folder populated
      const { data } = await get(`/upload/files/${id}`, {
        params: {
          populate: {
            folder: true,
          },
        },
      });
      
      return data;
    },
    {
      enabled: !!id && (options?.enabled !== false),
      staleTime: 0,
      cacheTime: 0,
    }
  );
};