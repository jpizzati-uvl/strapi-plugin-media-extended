import { useMutation, useQueryClient } from 'react-query';
import { useFetchClient, useNotification } from '@strapi/admin/strapi-admin';
import { useIntl } from 'react-intl';
import { PLUGIN_ID } from '../pluginId';

interface DeleteFileResponse {
  data: any;
}

export const useRemoveAsset = (onSuccess?: () => void) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const queryClient = useQueryClient();
  const { del } = useFetchClient();

  const mutation = useMutation(
    async (assetId: string | number) => {
      const { data } = await del<DeleteFileResponse>(`/upload/files/${assetId}`);
      return data;
    },
    {
      onSuccess() {
        queryClient.refetchQueries([PLUGIN_ID, 'assets']);
        queryClient.refetchQueries([PLUGIN_ID, 'asset-count']);
        
        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: 'modal.remove.success-label',
            defaultMessage: 'Asset has been successfully deleted.',
          }),
        });
        
        if (onSuccess) {
          onSuccess();
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
    removeAsset: mutation.mutate,
    isLoading: mutation.isLoading,
  };
};