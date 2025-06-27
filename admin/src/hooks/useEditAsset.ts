import { useMutation, useQueryClient } from 'react-query';
import { useFetchClient, useNotification } from '@strapi/admin/strapi-admin';
import { useIntl } from 'react-intl';
import { PLUGIN_ID } from '../pluginId';
import type { File as CustomFile } from '../utils/getAllowedFiles';

interface EditAssetParams {
  asset: CustomFile;
  file?: File;
  name?: string;
  alternativeText?: string;
  caption?: string;
  folder?: { id: number } | null;
}

export const useEditAsset = (onSuccess?: (data: any) => void) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const queryClient = useQueryClient();
  const { post } = useFetchClient();

  const mutation = useMutation(
    async ({ asset, file, ...data }: EditAssetParams) => {
      const formData = new FormData();
      
      if (file) {
        formData.append('files', file);
      }
      
      // Prepare folder value - explicitly handle null for root folder
      let folderValue: number | null | undefined;
      if (data.folder === null) {
        // Explicitly moving to root
        folderValue = null;
      } else if (data.folder?.id) {
        // Moving to a specific folder
        folderValue = data.folder.id;
      } else if (data.folder === undefined) {
        // Keep current folder (don't include in update)
        folderValue = undefined;
      } else {
        // Keep current folder
        folderValue = undefined;
      }
      
      const fileInfo: any = {
        name: data.name || asset.name,
        alternativeText: data.alternativeText || asset.alternativeText || '',
        caption: data.caption || asset.caption || '',
      };
      
      // Only include folder if it's being changed
      if (folderValue !== undefined) {
        fileInfo.folder = folderValue;
      }
      
      formData.append('fileInfo', JSON.stringify(fileInfo));

      // Always use the same endpoint for both file replacement and metadata updates
      const response = await post(`/upload?id=${asset.id}`, formData);
      // The response might be wrapped, extract the actual data
      return response.data?.[0] || response.data || response;
    },
    {
      onSuccess(data) {
        queryClient.refetchQueries([PLUGIN_ID, 'assets']);
        queryClient.refetchQueries([PLUGIN_ID, 'asset-count']);
        
        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: 'notification.asset.updated',
            defaultMessage: 'Asset updated successfully',
          }),
        });
        
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError() {
        toggleNotification({
          type: 'danger',
          message: formatMessage({
            id: 'notification.error',
            defaultMessage: 'An error occurred',
          }),
        });
      },
    }
  );

  return {
    editAsset: mutation.mutate,
    isLoading: mutation.isLoading,
  };
};