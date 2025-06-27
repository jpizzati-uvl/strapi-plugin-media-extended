import { Avatar, Box, Flex, Typography } from '@strapi/design-system';
import { Folder } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import { AssetTypeValues } from '../../../constants/index';
import {
  createAssetUrl,
  getFileExtension,
  getTrad,
  prefixFileUrlWithBackendUrl,
} from '../../../utils';
import { VideoPreview } from '../VideoPreview';

import type { File } from '../../../utils/getAllowedFiles';

const VideoPreviewWrapper = styled(Box)`
  figure {
    width: ${({ theme }) => theme.spaces[7]};
    height: ${({ theme }) => theme.spaces[7]};
  }

  canvas,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

interface PreviewCellProps {
  content: File;
  type?: string;
}

export const PreviewCell = ({ type, content }: PreviewCellProps) => {
  const { formatMessage } = useIntl();
  if (type === 'folder') {
    return (
      <Flex
        justifyContent="center"
        background="secondary100"
        width="3.2rem"
        height="3.2rem"
        borderRadius="50%"
      >
        <Folder
          aria-label={formatMessage({
            id: getTrad('header.actions.add-assets.folder'),
            defaultMessage: 'folder',
          })}
          fill="secondary500"
          width="1.6rem"
          height="1.6rem"
        />
      </Flex>
    );
  }

  const { alternativeText, ext, formats, mime, name, url } = content;

  if (mime?.includes(AssetTypeValues.Image)) {
    const mediaURL =
      prefixFileUrlWithBackendUrl(formats?.thumbnail?.url) ?? prefixFileUrlWithBackendUrl(url);

    return (
      <Avatar.Item
        src={mediaURL}
        alt={alternativeText || undefined}
        preview
        fallback={alternativeText}
      />
    );
  }

  if (mime?.includes(AssetTypeValues.Video)) {
    return (
      <VideoPreviewWrapper>
        <VideoPreview
          url={createAssetUrl(content, true) || ''}
          alt={alternativeText ?? name}
        />
      </VideoPreviewWrapper>
    );
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      background="secondary100"
      color="secondary600"
      width="3.2rem"
      height="3.2rem"
      borderRadius="50%"
    >
      <Typography variant="pi" fontWeight="bold">
        {getFileExtension(ext || undefined)}
      </Typography>
    </Flex>
  );
};