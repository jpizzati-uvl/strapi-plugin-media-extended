import { CarouselActions, IconButton } from '@strapi/design-system';
import { Pencil, Plus, Trash } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { getTrad } from '../../utils/getTrad';
import { prefixFileUrlWithBackendUrl } from '../../utils/prefixFileUrlWithBackendUrl';
import { CopyLinkButton } from './CopyLinkButton';
import type { File } from '../../utils/getAllowedFiles';

interface CarouselAssetActionsProps {
  asset: File;
  onDeleteAsset?: (asset: File) => void;
  onAddAsset?: (asset: File) => void;
  onEditAsset?: () => void;
}

export const CarouselAssetActions = ({
  asset,
  onDeleteAsset,
  onAddAsset,
  onEditAsset,
}: CarouselAssetActionsProps) => {
  const { formatMessage } = useIntl();

  return (
    <CarouselActions>
      {onAddAsset && (
        <IconButton
          label={formatMessage({
            id: getTrad('control-card.add'),
            defaultMessage: 'Add',
          })}
          onClick={() => onAddAsset(asset)}
        >
          <Plus />
        </IconButton>
      )}

      <CopyLinkButton url={prefixFileUrlWithBackendUrl(asset.url)!} />

      {onDeleteAsset && (
        <IconButton
          label={formatMessage({
            id: 'global.delete',
            defaultMessage: 'Delete',
          })}
          onClick={() => onDeleteAsset(asset)}
        >
          <Trash />
        </IconButton>
      )}

      {onEditAsset && (
        <IconButton
          label={formatMessage({
            id: getTrad('control-card.edit'),
            defaultMessage: 'Edit',
          })}
          onClick={onEditAsset}
        >
          <Pencil />
        </IconButton>
      )}
    </CarouselActions>
  );
};