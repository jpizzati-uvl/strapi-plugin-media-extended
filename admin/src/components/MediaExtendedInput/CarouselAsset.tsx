import { Box, Flex } from '@strapi/design-system';
import { File, FilePdf } from '@strapi/icons';
import { styled } from 'styled-components';
import { AssetTypeValues } from '../../constants/index';
import { createAssetUrl } from '../../utils/createAssetUrl';
import type { File as FileAsset } from '../../utils/getAllowedFiles';
import { VideoPreview } from './VideoPreview';

const DocAsset = styled(Flex)`
  background: linear-gradient(180deg, #ffffff 0%, #f6f6f9 121.48%);
`;

export const CarouselAsset = ({ asset }: { asset: FileAsset }) => {
  if (asset.mime?.includes(AssetTypeValues.Video)) {
    return (
      <Box height="100%" width="100%" position="relative">
        <VideoPreview
          url={createAssetUrl(asset, false)}
          alt={asset.alternativeText || asset.name}
        />
      </Box>
    );
  }

  if (asset.mime?.includes(AssetTypeValues.Audio)) {
    return (
      <Box>
        <audio
          controls
          src={createAssetUrl(asset, true)}
          style={{ maxWidth: '100%' }}
        >
          {asset.alternativeText || asset.name}
        </audio>
      </Box>
    );
  }

  if (asset.mime?.includes(AssetTypeValues.Image)) {
    return (
      <Box
        tag="img"
        maxHeight="100%"
        maxWidth="100%"
        src={createAssetUrl(asset, true)}
        alt={asset.alternativeText || asset.name}
      />
    );
  }

  return (
    <DocAsset width="100%" height="100%" justifyContent="center" hasRadius>
      {asset.ext?.includes('pdf') ? (
        <FilePdf aria-label={asset.alternativeText || asset.name} width="24px" height="32px" />
      ) : (
        <File aria-label={asset.alternativeText || asset.name} width="24px" height="32px" />
      )}
    </DocAsset>
  );
};