import * as React from 'react';
import { Box, Flex, Typography } from '@strapi/design-system';
import { File, FilePdf } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

const CardAsset = styled(Flex)`
  min-height: 26.4rem;
  border-radius: ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius} 0 0;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.neutral0} 0%,
    ${({ theme }) => theme.colors.neutral100} 121.48%
  );
`;

interface AssetPreviewProps {
  mime: string;
  name: string;
  url: string;
  onLoad?: () => void;
}

export const AssetPreview = React.forwardRef<
  HTMLImageElement | HTMLVideoElement | HTMLAudioElement,
  AssetPreviewProps
>(({ mime, url, name, ...props }, ref) => {
  const { formatMessage } = useIntl();

  if (mime.includes('image')) {
    return (
      <img ref={ref as React.ForwardedRef<HTMLImageElement>} src={url} alt={name} {...props} />
    );
  }

  if (mime.includes('video')) {
    return <video controls src={url} ref={ref as React.ForwardedRef<HTMLVideoElement>} {...props}>{name}</video>;
  }

  if (mime.includes('audio')) {
    return (
      <Box margin="5">
        <audio controls src={url} ref={ref as React.ForwardedRef<HTMLAudioElement>} {...props}>
          {name}
        </audio>
      </Box>
    );
  }

  if (mime.includes('pdf')) {
    return (
      <CardAsset width="100%" justifyContent="center" {...props}>
        <Flex gap={2} direction="column" alignItems="center">
          <FilePdf aria-label={name} fill="neutral500" width={24} height={24} />
          <Typography textColor="neutral500" variant="pi">
            {formatMessage({
              id: 'noPreview',
              defaultMessage: 'No preview available',
            })}
          </Typography>
        </Flex>
      </CardAsset>
    );
  }

  return (
    <CardAsset width="100%" justifyContent="center" {...props}>
      <Flex gap={2} direction="column" alignItems="center">
        <File aria-label={name} fill="neutral500" width={24} height={24} />
        <Typography textColor="neutral500" variant="pi">
          {formatMessage({
            id: 'noPreview',
            defaultMessage: 'No preview available',
          })}
        </Typography>
      </Flex>
    </CardAsset>
  );
});

AssetPreview.displayName = 'AssetPreview';