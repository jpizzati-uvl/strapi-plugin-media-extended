import { AssetTypeValues } from '../../../constants/index';
import { File } from '../../../utils/getAllowedFiles';
import { Asset } from '../UploadAssetDialog/UploadAssetDialog';
import { ImageAssetCard } from './ImageAssetCard';
import { VideoAssetCard } from './VideoAssetCard';
import { DocAssetCard } from './DocAssetCard';

export type AllowedTypes = 'files' | 'images' | 'videos' | 'audios';

interface AssetCardProps {
  asset: File | Asset;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  size?: 'S' | 'M';
  className?: string;
}

export const AssetCard = ({
  asset,
  isSelected = false,
  onSelect = () => {},
  onEdit,
  onRemove,
  size = 'M',
  className,
}: AssetCardProps) => {
  const extension = (asset.ext || '').replace('.', '').toUpperCase();

  const commonAssetCardProps = {
    extension,
    name: asset.name,
    onEdit,
    onSelect,
    onRemove,
    selected: isSelected,
    size,
    className,
  };

  if (asset.mime?.includes(AssetTypeValues.Video)) {
    return (
      <VideoAssetCard
        {...commonAssetCardProps}
        url={asset.url || ''}
        mime={asset.mime}
        alt={asset.alternativeText || asset.name}
      />
    );
  }

  if (asset.mime?.includes(AssetTypeValues.Image)) {
    return (
      <ImageAssetCard
        alt={asset.alternativeText || asset.name}
        height={asset.height}
        thumbnail={asset.url || ''}
        width={asset.width}
        {...commonAssetCardProps}
      />
    );
  }

  if (asset.mime?.includes(AssetTypeValues.Audio)) {
    // For now, treat audio as doc
    return <DocAssetCard {...commonAssetCardProps} />;
  }

  return <DocAssetCard {...commonAssetCardProps} />;
};