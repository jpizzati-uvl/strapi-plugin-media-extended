import * as React from 'react';

import { Modal } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { EditAssetContent } from '../EditAssetDialog/EditAssetContent';
import { File as MediaFile } from '../../../utils/getAllowedFiles';
import { AssetType } from '../../../constants/index';

import { AddAssetStep } from './AddAssetStep';
import { PendingAssetStep } from './PendingAssetStep';

const Steps = {
  AddAsset: 'AddAsset',
  PendingAsset: 'PendingAsset',
};

export interface FileWithRawFile {
  id?: string | number;
  name: string;
  url?: string;
  mime?: string;
  size?: number;
  ext?: string;
  width?: number;
  height?: number;
  rawFile?: File;
  isLocal?: boolean;
  error?: string;
  tempId?: string;
  alternativeText?: string | null;
  caption?: string | null;
}

export interface Asset extends FileWithRawFile {
  folder?: { id: number; name?: string } | number;
  type?: AssetType;
}

export interface UploadAssetDialogProps {
  addUploadedFiles?: (files: Asset[] | MediaFile[]) => void;
  folderId?: string | number | null;
  initialAssetsToAdd?: Asset[];
  onClose: () => void;
  open: boolean;
  trackedLocation?: string;
  validateAssetsTypes?: (
    assets: Asset[],
    cb: (assets?: Asset[], error?: string) => void
  ) => void;
}

export const UploadAssetDialog = ({
  initialAssetsToAdd,
  folderId = null,
  onClose = () => {},
  addUploadedFiles,
  trackedLocation,
  open,
  validateAssetsTypes = (_, cb) => cb(),
}: UploadAssetDialogProps) => {
  const { formatMessage } = useIntl();
  const [step, setStep] = React.useState(initialAssetsToAdd ? Steps.PendingAsset : Steps.AddAsset);
  const [assets, setAssets] = React.useState<Asset[]>(initialAssetsToAdd || []);
  const [assetToEdit, setAssetToEdit] = React.useState<Asset | undefined>(undefined);

  const handleAddToPendingAssets = (nextAssets: Asset[]) => {
    validateAssetsTypes(nextAssets, () => {
      setAssets((prevAssets) => prevAssets.concat(nextAssets));
      setStep(Steps.PendingAsset);
    });
  };

  const moveToAddAsset = () => {
    setStep(Steps.AddAsset);
  };

  const handleCancelUpload = (file: File) => {
    const nextAssets = assets.filter((asset) => asset.rawFile !== file);
    setAssets(nextAssets);

    // When there's no asset, transition to the AddAsset step
    if (nextAssets.length === 0) {
      moveToAddAsset();
    }
  };

  const handleUploadSuccess = (file: File) => {
    const nextAssets = assets.filter((asset) => asset.rawFile !== file);
    setAssets(nextAssets);

    if (nextAssets.length === 0) {
      onClose();
    }
  };

  const handleAssetEditValidation = (nextAsset?: Asset | boolean | null) => {
    if (nextAsset && typeof nextAsset !== 'boolean') {
      const nextAssets = assets.map((asset) => (asset === assetToEdit ? nextAsset : asset));
      setAssets(nextAssets);
    }

    setAssetToEdit(undefined);
  };

  const handleClose = () => {
    if (step === Steps.PendingAsset && assets.length > 0) {
      // eslint-disable-next-line no-alert
      const confirm = window.confirm(
        formatMessage({
          id: 'window.confirm.close-modal.files',
          defaultMessage: 'Are you sure? You have some files that have not been uploaded yet.',
        })
      );

      if (confirm) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleRemoveAsset = (assetToRemove: Asset) => {
    const nextAssets = assets.filter((asset) => asset !== assetToRemove);
    setAssets(nextAssets);
  };

  return (
    <Modal.Root open={open} onOpenChange={handleClose}>
      {step === Steps.AddAsset && (
        <Modal.Content>
          <AddAssetStep
            onClose={onClose}
            onAddAsset={(assets: FileWithRawFile[]) =>
              handleAddToPendingAssets(assets as Asset[])
            }
            trackedLocation={trackedLocation}
          />
        </Modal.Content>
      )}

      {step === Steps.PendingAsset && (
        <Modal.Content>
          <PendingAssetStep
            onClose={handleClose}
            assets={assets}
            onEditAsset={setAssetToEdit}
            onRemoveAsset={handleRemoveAsset}
            onClickAddAsset={moveToAddAsset}
            onCancelUpload={handleCancelUpload}
            onUploadSucceed={handleUploadSuccess}
            initialAssetsToAdd={initialAssetsToAdd}
            addUploadedFiles={addUploadedFiles}
            folderId={folderId}
            trackedLocation={trackedLocation}
          />
        </Modal.Content>
      )}

      {assetToEdit && (
        <Modal.Content>
          <EditAssetContent
            onClose={handleAssetEditValidation}
            asset={assetToEdit}
            canUpdate
          />
        </Modal.Content>
      )}
    </Modal.Root>
  );
};