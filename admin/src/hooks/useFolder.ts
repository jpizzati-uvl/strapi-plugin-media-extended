import { useQuery } from 'react-query';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { Folder } from '../services/api';

interface UseFolderOptions {
  id?: number | null;
  enabled?: boolean;
}

export const useFolder = ({ id, enabled = true }: UseFolderOptions = {}) => {
  const { get } = useFetchClient();
  
  const { data, error, isLoading } = useQuery(
    ['upload', 'folder', id],
    async () => {
      if (!id) return null;
      
      const { data } = await get(`/upload/folders/${id}?populate[parent][populate][0]=parent`);
      
      return data.data as Folder;
    },
    {
      enabled: enabled && !!id,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  return { data, error, isLoading };
};