import * as React from 'react';
import { AssetDialog } from './AssetDialog';
import { UploadAssetDialog } from './UploadAssetDialog';
import { EditFolderDialog } from './EditFolderDialog';

type AllowedTypes = 'files' | 'images' | 'videos' | 'audios';

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectAssets: (assets: any[]) => void;
  multiple?: boolean;
  allowedTypes?: AllowedTypes[] | null;
  selectedAssets?: any[];
}

const STEPS = {
  AssetSelect: 'SelectAsset',
  AssetUpload: 'UploadAsset',
  FolderCreate: 'FolderCreate',
};

export const MediaLibraryDialog = ({
  open,
  onClose,
  onSelectAssets,
  multiple = true,
  allowedTypes = null,
  selectedAssets: initiallySelectedAssets = [],
}: MediaLibraryDialogProps) => {
  const [step, setStep] = React.useState<string | undefined>(STEPS.AssetSelect);
  const [folderId, setFolderId] = React.useState<number | null>(null);
  const [uploadedAssets, setUploadedAssets] = React.useState<any[]>([]);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setStep(STEPS.AssetSelect);
      setUploadedAssets([]);
    }
  }, [open]);

  if (!open && !step) return null;

  const handleClose = () => {
    setStep(undefined);
    setFolderId(null);
    setUploadedAssets([]);
    onClose();
  };

  const handleSelectAssets = (assets: any[]) => {
    onSelectAssets(assets);
    handleClose();
  };

  const handleUploadSuccess = (assets: any[]) => {
    const allAssets = [...uploadedAssets, ...assets];
    setUploadedAssets(allAssets);
    // Automatically select and close after upload
    handleSelectAssets(allAssets);
  };

  return (
    <>
      {step === STEPS.AssetSelect && (
        <AssetDialog
          open={step === STEPS.AssetSelect}
          allowedTypes={allowedTypes}
          folderId={folderId}
          onClose={handleClose}
          onValidate={handleSelectAssets}
          multiple={multiple}
          onAddAsset={() => setStep(STEPS.AssetUpload)}
          onAddFolder={() => setStep(STEPS.FolderCreate)}
          onChangeFolder={setFolderId}
          initiallySelectedAssets={[...initiallySelectedAssets, ...uploadedAssets]}
        />
      )}
      
      {step === STEPS.AssetUpload && (
        <UploadAssetDialog
          open={step === STEPS.AssetUpload}
          onClose={() => setStep(STEPS.AssetSelect)}
          folderId={folderId}
          addUploadedFiles={handleUploadSuccess}
        />
      )}
      
      {step === STEPS.FolderCreate && (
        <EditFolderDialog
          open={step === STEPS.FolderCreate}
          onClose={() => setStep(STEPS.AssetSelect)}
          parentFolderId={folderId}
        />
      )}
    </>
  );
};