import * as React from 'react';
import { useNotification, useFetchClient } from '@strapi/admin/strapi-admin';
import { useMutation, useQueryClient } from 'react-query';
import { Box, Flex, Typography } from '@strapi/design-system';
import { Cross } from '@strapi/icons';
import { styled } from 'styled-components';
import { AssetCardBase } from './AssetCardBase';
import { File as MediaFile } from '../../../utils/getAllowedFiles';
import { Asset } from '../UploadAssetDialog/UploadAssetDialog';
import { PLUGIN_ID } from '../../../constants/index';

const UploadProgress = styled(Box)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.neutral150};
`;

const UploadProgressBar = styled.div<{ $percent: number }>`
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary600};
  width: ${({ $percent }) => `${$percent}%`};
  transition: width 0.3s;
`;

interface UploadingAssetCardProps {
  onCancel: (rawFile: File) => void;
  onStatusChange: (status: string) => void;
  addUploadedFiles: (files: MediaFile[]) => void;
  folderId?: string | number | null;
  asset: Asset;
  id?: string;
  size?: 'S' | 'M';
}

export const UploadingAssetCard = ({
  asset,
  onCancel,
  onStatusChange,
  addUploadedFiles,
  folderId,
  size = 'M',
}: UploadingAssetCardProps) => {
  const { toggleNotification } = useNotification();
  const queryClient = useQueryClient();
  const { post } = useFetchClient();
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const uploadMutation = useMutation(
    async () => {
      if (!asset.rawFile) {
        throw new Error('No raw file to upload');
      }

      abortControllerRef.current = new AbortController();

      const formData = new FormData();
      formData.append('files', asset.rawFile);

      if (asset.alternativeText || asset.caption || asset.name) {
        formData.append('fileInfo', JSON.stringify({
          alternativeText: asset.alternativeText,
          caption: asset.caption,
          name: asset.name,
        }));
      }

      if (folderId) {
        formData.append('folder', folderId.toString());
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        const response = await post('/upload', formData, {
          signal: abortControllerRef.current.signal,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        return response.data;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        const uploadedFiles = Array.isArray(data) ? data : [data];
        addUploadedFiles(uploadedFiles);
        onStatusChange('success');
        
        queryClient.refetchQueries([PLUGIN_ID, 'assets']);
        queryClient.refetchQueries([PLUGIN_ID, 'asset-count']);
      },
      onError: (error: any) => {
        const message = error?.response?.data?.error?.message || 'Upload failed';
        toggleNotification({
          type: 'danger',
          message,
        });
        onStatusChange('error');
      },
    }
  );

  React.useEffect(() => {
    uploadMutation.mutate();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (asset.rawFile) {
      onCancel(asset.rawFile);
    }
  };

  return (
    <AssetCardBase
      name={asset.name}
      extension={asset.ext || ''}
      size={size}
      variant="Uploading"
      onCancel={handleCancel}
    >
      <Box position="relative" width="100%" height="100%">
        <Flex 
          direction="column" 
          alignItems="center" 
          justifyContent="center" 
          height="100%" 
          width="100%"
        >
          <Cross width="16px" height="16px" />
          <Typography variant="pi" fontWeight="bold" tag="p" marginTop={2}>
            {uploadProgress}%
          </Typography>
        </Flex>
        <UploadProgress>
          <UploadProgressBar $percent={uploadProgress} />
        </UploadProgress>
      </Box>
    </AssetCardBase>
  );
};