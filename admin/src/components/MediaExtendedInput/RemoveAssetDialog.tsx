import * as React from 'react';
import { ConfirmDialog } from '@strapi/admin/strapi-admin';
import { Dialog } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTrad } from '../../utils/getTrad';
import { useRemoveAsset } from '../../hooks/useRemoveAsset';

interface RemoveAssetDialogProps {
  open: boolean;
  onClose: (deletedAsset?: any) => void;
  asset: any;
}

export const RemoveAssetDialog = ({ open, onClose, asset }: RemoveAssetDialogProps) => {
  const { formatMessage } = useIntl();
  const { removeAsset } = useRemoveAsset(() => {
    onClose(null);
  });

  const handleConfirm = async (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.preventDefault();
    removeAsset(asset.id);
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => onClose()}>
      <ConfirmDialog 
        onConfirm={handleConfirm}
        title={formatMessage({
          id: getTrad('modal.remove.confirmation.title'),
          defaultMessage: 'Confirmation',
        })}
      >
        {formatMessage({
          id: getTrad('modal.remove.confirmation.description'),
          defaultMessage: 'Are you sure you want to delete this?',
        })}
      </ConfirmDialog>
    </Dialog.Root>
  );
};