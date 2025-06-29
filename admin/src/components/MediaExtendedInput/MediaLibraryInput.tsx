import * as React from 'react';
import { useNotification } from '@strapi/admin/strapi-admin';
import { useField } from '@strapi/strapi/admin';
import { CarouselInput, CarouselSlide } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTrad } from '../../utils/getTrad';
import { getAllowedFiles, type AllowedFiles, type File } from '../../utils/getAllowedFiles';
import { EmptyStateAsset } from './EmptyStateAsset';
import { CarouselAsset } from './CarouselAsset';
import { CarouselAssetActions } from './CarouselAssetActions';
import { AssetDialog } from './AssetDialog';
import { UploadAssetDialog } from './UploadAssetDialog';
import { EditFolderDialog } from './EditFolderDialog';
import { EditAssetDialog } from './EditAssetDialog';

type AllowedTypes = 'files' | 'images' | 'videos' | 'audios';
type FileWithoutIdHash = Omit<File, 'id' | 'hash'>;

const STEPS = {
  AssetSelect: 'SelectAsset',
  AssetUpload: 'UploadAsset',
  FolderCreate: 'FolderCreate',
};

export interface MediaLibraryInputProps {
  required?: boolean;
  name: string;
  labelAction?: React.ReactNode;
  label?: string;
  hint?: string;
  disabled?: boolean;
  attribute?: {
    type?: string;
    customField?: string;
    options?: {
      allowedTypes?: AllowedTypes[];
      multiple?: boolean;
      'options.allowedTypes'?: AllowedTypes[];
      'options.multiple'?: boolean;
    };
  };
}

export const MediaLibraryInput = React.forwardRef<HTMLDivElement, MediaLibraryInputProps>(
  (
    {
      attribute,
      label,
      hint,
      disabled = false,
      labelAction = undefined,
      name,
      required = false,
    },
    forwardedRef
  ) => {
    // Extract options from attribute
    // The options come with 'options.' prefix from the field configuration
    const allowedTypes = attribute?.options?.['options.allowedTypes'] || null;
    const multiple = attribute?.options?.['options.multiple'] || false;
    
    const { formatMessage } = useIntl();
    const field = useField(name);
    const { value, error } = field;
    const [step, setStep] = React.useState<string | undefined>(undefined);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [folderId, setFolderId] = React.useState<number | null>(null);
    const [droppedAssets, setDroppedAssets] = React.useState<FileWithoutIdHash[]>();
    const [isEditingAsset, setIsEditingAsset] = React.useState(false);
    const { toggleNotification } = useNotification();

    let selectedAssets: File[] = [];

    if (Array.isArray(value)) {
      selectedAssets = value;
    } else if (value) {
      selectedAssets = [value];
    }

    const handleValidation = (nextSelectedAssets: File[]) => {
      const newValue = multiple ? nextSelectedAssets : nextSelectedAssets[0];
      field.onChange(name, newValue);
      setStep(undefined);
    };

    const handleAssetDrop = (assets: FileWithoutIdHash[]) => {
      const allowedAssets = getAllowedFiles(allowedTypes, assets as AllowedFiles[]);
      
      if (allowedAssets.length > 0) {
        setDroppedAssets(allowedAssets);
        setStep(STEPS.AssetUpload);
      } else {
        toggleNotification({
          type: 'danger',
          timeout: 4000,
          message: formatMessage(
            {
              id: getTrad('input.notification.not-supported'),
              defaultMessage: `You can't upload this type of file.`,
            },
            {
              fileTypes: (allowedTypes ?? []).join(','),
            }
          ),
        });
      }
    };

    const handleDeleteAsset = (asset: File) => {
      let nextValue;

      if (multiple) {
        const nextSelectedAssets = selectedAssets.filter((prevAsset) => prevAsset.id !== asset.id);
        nextValue = nextSelectedAssets.length > 0 ? nextSelectedAssets : null;
      } else {
        nextValue = null;
      }

      field.onChange(name, nextValue);
      setSelectedIndex(0);
    };

    const handleNext = () => {
      setSelectedIndex((current) => (current < selectedAssets.length - 1 ? current + 1 : 0));
    };

    const handlePrevious = () => {
      setSelectedIndex((current) => (current > 0 ? current - 1 : selectedAssets.length - 1));
    };

    let displayedLabel = label;
    if (multiple && selectedAssets.length > 0) {
      displayedLabel = `${label} (${selectedIndex + 1} / ${selectedAssets.length})`;
    }

    const currentAsset = selectedAssets[selectedIndex];

    return (
      <>
        <CarouselInput
              ref={forwardedRef}
              label={displayedLabel || ''}
              labelAction={labelAction}
              selectedSlide={selectedIndex}
              previousLabel={formatMessage({
                id: getTrad('mediaLibraryInput.actions.previousSlide'),
                defaultMessage: 'Previous slide',
              })}
              nextLabel={formatMessage({
                id: getTrad('mediaLibraryInput.actions.nextSlide'),
                defaultMessage: 'Next slide',
              })}
              onNext={handleNext}
              onPrevious={handlePrevious}
              secondaryLabel={currentAsset?.name}
              hint={hint}
              error={error}
              required={required}
              actions={
                currentAsset ? (
                  <CarouselAssetActions
                    asset={currentAsset}
                    onDeleteAsset={disabled ? undefined : handleDeleteAsset}
                    onAddAsset={disabled ? undefined : () => setStep(STEPS.AssetSelect)}
                    onEditAsset={disabled ? undefined : () => setIsEditingAsset(true)}
                  />
                ) : undefined
              }
            >
              {selectedAssets.length === 0 ? (
                <CarouselSlide
                  label={formatMessage(
                    {
                      id: getTrad('mediaLibraryInput.slideCount'),
                      defaultMessage: '{n} of {m} slides',
                    },
                    { n: 1, m: 1 }
                  )}
                >
                  <EmptyStateAsset
                    disabled={disabled}
                    onClick={() => !disabled && setStep(STEPS.AssetSelect)}
                    onDropAsset={handleAssetDrop}
                  />
                </CarouselSlide>
              ) : (
                selectedAssets.map((asset, index) => (
                  <CarouselSlide
                    key={asset.id}
                    label={formatMessage(
                      {
                        id: getTrad('mediaLibraryInput.slideCount'),
                        defaultMessage: '{n} of {m} slides',
                      },
                      { n: index + 1, m: selectedAssets.length }
                    )}
                  >
                    <CarouselAsset asset={asset} />
                  </CarouselSlide>
                ))
              )}
        </CarouselInput>

        {step === STEPS.AssetSelect && (
          <AssetDialog
            allowedTypes={allowedTypes}
            folderId={folderId}
            onClose={() => {
              setStep(undefined);
              setFolderId(null);
            }}
            open={step === STEPS.AssetSelect}
            onValidate={handleValidation}
            multiple={multiple}
            onAddAsset={() => setStep(STEPS.AssetUpload)}
            onAddFolder={() => setStep(STEPS.FolderCreate)}
            onChangeFolder={(folder) => setFolderId(folder)}
            initiallySelectedAssets={selectedAssets}
          />
        )}
        
        {step === STEPS.AssetUpload && (
          <UploadAssetDialog
            open={step === STEPS.AssetUpload}
            onClose={() => {
              setStep(STEPS.AssetSelect);
              setDroppedAssets(undefined);
            }}
            addUploadedFiles={(uploadedAssets) => {
              const newAssets = multiple 
                ? [...selectedAssets, ...(uploadedAssets as File[])]
                : (uploadedAssets as File[]).slice(0, 1);
              handleValidation(newAssets);
            }}
            initialAssetsToAdd={droppedAssets?.map(asset => ({
              id: (asset as any).id,
              name: asset.name,
              url: asset.url,
              mime: asset.mime,
              size: asset.size,
              ext: asset.ext || undefined,
              width: asset.width || undefined,
              height: asset.height || undefined,
              rawFile: (asset as any).rawFile,
              isLocal: true,
              tempId: `${Date.now()}-${Math.random()}`,
            }))}
            folderId={folderId}
          />
        )}
        
        {step === STEPS.FolderCreate && (
          <EditFolderDialog
            open={step === STEPS.FolderCreate}
            onClose={() => setStep(STEPS.AssetSelect)}
            parentFolderId={folderId}
          />
        )}
        
        <EditAssetDialog
          open={isEditingAsset}
          onClose={(editedAsset) => {
            setIsEditingAsset(false);
            if (editedAsset === null) {
              // Asset was deleted
              const nextSelectedAssets = selectedAssets.filter((prevAsset) =>
                prevAsset.id !== currentAsset?.id
              );
              field.onChange(name, multiple ? nextSelectedAssets : null);
            } else if (editedAsset && typeof editedAsset !== 'boolean') {
              // Asset was updated
              const nextSelectedAssets = selectedAssets.map((prevAsset) =>
                prevAsset.id === editedAsset.id ? editedAsset : prevAsset
              );
              field.onChange(name, multiple ? nextSelectedAssets : nextSelectedAssets[0]);
            }
          }}
          asset={currentAsset}
          canUpdate
          canCopyLink
          canDownload
        />
      </>
    );
  }
);