import * as React from 'react';
import { Flex, IconButton } from '@strapi/design-system';
import { Crop as Resize, Download as DownloadIcon, Trash, Link } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useCropImg } from '../../../hooks/useCropImg';
import { createAssetUrl, getTrad } from '../../../utils';
import { downloadFile } from '../../../utils/downloadFile';
import { CopyLinkButton } from '../CopyLinkButton';
import { UploadProgress } from '../UploadProgress';
import { RemoveAssetDialog } from '../RemoveAssetDialog';
import { AssetPreview } from './AssetPreview';
import { CroppingActions } from '../CroppingActions';
import {
  ActionRow,
  BadgeOverride,
  RelativeBox,
  UploadProgressWrapper,
  Wrapper,
} from '../PreviewComponents';
import type { File as FileDefinition } from '../../../utils/getAllowedFiles';

import 'cropperjs/dist/cropper.css';

interface Asset extends FileDefinition {
  isLocal?: boolean;
  rawFile?: File;
}

interface PreviewBoxProps {
  asset: Asset;
  canUpdate: boolean;
  canCopyLink: boolean;
  canDownload: boolean;
  replacementFile?: File;
  onDelete: (asset?: Asset | null) => void;
  onCropFinish: (croppedFile?: File) => void;
  onCropStart: () => void;
  onCropCancel: () => void;
  trackedLocation?: string;
}

export const PreviewBox = ({
  asset,
  canUpdate,
  canCopyLink,
  canDownload,
  onDelete,
  onCropFinish,
  onCropStart,
  onCropCancel,
  replacementFile,
  trackedLocation,
}: PreviewBoxProps) => {
  const previewRef = React.useRef(null);
  const [isCropImageReady, setIsCropImageReady] = React.useState(false);
  const [hasCropIntent, setHasCropIntent] = React.useState<boolean | null>(null);
  const [assetUrl, setAssetUrl] = React.useState(createAssetUrl(asset, false));
  const [thumbnailUrl, setThumbnailUrl] = React.useState(createAssetUrl(asset, true));
  const { formatMessage } = useIntl();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { crop, produceFile, stopCropping, isCropping, isCropperReady, width, height } =
    useCropImg();

  React.useEffect(() => {
    if (replacementFile && replacementFile instanceof File) {
      const fileLocalUrl = URL.createObjectURL(replacementFile);
      setAssetUrl(fileLocalUrl);
      setThumbnailUrl(fileLocalUrl);
    }
  }, [replacementFile]);

  React.useEffect(() => {
    // Update URLs when asset changes (e.g., after replacement)
    if (!replacementFile) {
      setAssetUrl(createAssetUrl(asset, false));
      setThumbnailUrl(createAssetUrl(asset, true));
    }
  }, [asset, replacementFile]);

  React.useEffect(() => {
    if (hasCropIntent === false) {
      stopCropping();
      onCropCancel();
    }
  }, [hasCropIntent, stopCropping, onCropCancel]);

  React.useEffect(() => {
    if (hasCropIntent && isCropImageReady) {
      crop(previewRef.current!);
      onCropStart();
    }
  }, [isCropImageReady, hasCropIntent, onCropStart, crop]);

  const handleCropping = async () => {
    const file = (await produceFile(
      asset.name,
      asset.mime || '',
      asset.updatedAt || new Date().toISOString()
    )) as File;

    setHasCropIntent(false);
    
    // For local assets, update the preview immediately
    if (asset.isLocal) {
      const fileLocalUrl = URL.createObjectURL(file);
      setAssetUrl(fileLocalUrl);
      setThumbnailUrl(fileLocalUrl);
    }
    
    // Pass the cropped file to the parent component to handle the save
    onCropFinish(file);
  };

  const isInCroppingMode = isCropping;

  const handleCropCancel = () => {
    setHasCropIntent(false);
  };

  const handleCropStart = () => {
    setHasCropIntent(true);
  };

  const handleCopyLink = () => {
    if (assetUrl) {
      navigator.clipboard.writeText(assetUrl);
    }
  };

  return (
    <>
      <RelativeBox hasRadius background="neutral150" borderColor="neutral200">
        {isCropperReady && isInCroppingMode && (
          <CroppingActions
            onValidate={handleCropping}
            onCancel={handleCropCancel}
          />
        )}

        <ActionRow paddingLeft={3} paddingRight={3} justifyContent="flex-end">
          <Flex gap={1}>
            {canUpdate && !asset.isLocal && (
              <IconButton
                label={formatMessage({
                  id: 'global.delete',
                  defaultMessage: 'Delete',
                })}
                onClick={() => setShowConfirmDialog(true)}
              >
                <Trash />
              </IconButton>
            )}

            {canDownload && (
              <IconButton
                label={formatMessage({
                  id: getTrad('control-card.download'),
                  defaultMessage: 'Download',
                })}
                onClick={() => downloadFile(assetUrl!, asset.name)}
              >
                <DownloadIcon />
              </IconButton>
            )}

            {canCopyLink && (
              <IconButton
                label={formatMessage({
                  id: 'global.copy-link',
                  defaultMessage: 'Copy link',
                })}
                onClick={handleCopyLink}
              >
                <Link />
              </IconButton>
            )}

            {canUpdate && asset.mime?.includes('image') && (
              <IconButton
                label={formatMessage({ id: getTrad('control-card.crop'), defaultMessage: 'Crop' })}
                onClick={handleCropStart}
              >
                <Resize />
              </IconButton>
            )}
          </Flex>
        </ActionRow>

        <Wrapper>
          <AssetPreview
            ref={previewRef}
            mime={asset.mime!}
            name={asset.name}
            url={hasCropIntent ? assetUrl! : thumbnailUrl!}
            onLoad={() => {
              if (asset.isLocal || hasCropIntent) {
                setIsCropImageReady(true);
              }
            }}
          />
        </Wrapper>

        <ActionRow
          paddingLeft={2}
          paddingRight={2}
          justifyContent="flex-end"
          $blurry={isInCroppingMode}
        >
          {isInCroppingMode && width && height && (
            <BadgeOverride background="neutral900" color="neutral0">
              {width && height ? `${height}×${width}` : 'N/A'}
            </BadgeOverride>
          )}
        </ActionRow>
      </RelativeBox>

      <RemoveAssetDialog
        open={showConfirmDialog}
        onClose={(deletedAsset) => {
          setShowConfirmDialog(false);
          if (deletedAsset === null) {
            // Asset was deleted
            onDelete(null);
          }
        }}
        asset={asset}
      />
    </>
  );
};