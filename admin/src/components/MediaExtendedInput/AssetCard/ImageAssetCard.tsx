import { CardAsset } from '@strapi/design-system';
import { AssetCardBase, AssetCardBaseProps } from './AssetCardBase';

interface ImageAssetCardProps extends Omit<AssetCardBaseProps, 'variant' | 'children'> {
  height?: number | null;
  width?: number | null;
  size?: 'S' | 'M';
  thumbnail: string;
  alt: string;
}

export const ImageAssetCard = ({
  height,
  width,
  thumbnail,
  size = 'M',
  alt,
  selected = false,
  ...props
}: ImageAssetCardProps) => {
  const subtitle = height && width ? ` - ${width}✕${height}` : undefined;

  return (
    <AssetCardBase {...props} selected={selected} subtitle={subtitle} variant="Image" size={size}>
      <CardAsset src={thumbnail} size={size} alt={alt} />
    </AssetCardBase>
  );
};