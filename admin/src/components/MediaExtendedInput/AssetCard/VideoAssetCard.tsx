import * as React from 'react';
import { CardAsset, CardTimer } from '@strapi/design-system';
import { AssetCardBase, AssetCardBaseProps } from './AssetCardBase';
import { VideoPreview } from '../VideoPreview';
import { formatDuration } from '../../../utils/formatDuration';

interface VideoAssetCardProps extends Omit<AssetCardBaseProps, 'variant' | 'children'> {
  size?: 'S' | 'M';
  url: string;
  mime: string;
  alt?: string;
}

export const VideoAssetCard = ({
  size = 'M',
  url,
  mime,
  alt,
  selected = false,
  ...props
}: VideoAssetCardProps) => {
  const [duration, setDuration] = React.useState<number | null>(null);

  return (
    <AssetCardBase {...props} selected={selected} variant="Video" size={size}>
      <CardAsset size={size}>
        <VideoPreview
          url={url}
          alt={alt}
          onLoadDuration={setDuration}
        />
      </CardAsset>
      {duration !== null && (
        <CardTimer>{formatDuration(duration)}</CardTimer>
      )}
    </AssetCardBase>
  );
};