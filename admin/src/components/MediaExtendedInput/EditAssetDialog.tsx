import * as React from 'react';
import {
  Modal,
  Button,
  TextInput,
  Field,
  Flex,
  Box,
  Typography,
  Grid,
  Loader,
  VisuallyHidden,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useNotification } from '@strapi/admin/strapi-admin';
import { useEditAsset } from '../../hooks/useEditAsset';
import { useAsset } from '../../hooks/useAsset';
import { styled } from 'styled-components';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import isEqual from 'lodash/isEqual';
import { getTrad } from '../../utils/getTrad';
import type { File as CustomFile } from '../../utils/getAllowedFiles';
import { ContextInfo } from './ContextInfo';
import { ReplaceMediaButton } from './ReplaceMediaButton';
import { SelectTree, OptionSelectTree } from './SelectTree';
import { useFolderStructure } from '../../hooks/useFolderStructure';
import { PreviewBox } from './PreviewBox/PreviewBox';
import { findRecursiveFolderByValue } from '../../utils/findRecursiveFolderByValue';

interface EditAssetDialogProps {
  open: boolean;
  onClose: (editedAsset?: CustomFile | null | boolean) => void;
  asset?: CustomFile;
  canUpdate?: boolean;
  canCopyLink?: boolean;
  canDownload?: boolean;
}

const LoadingBody = styled(Flex)`
  min-height: calc(60vh + 8rem);
`;


const fileInfoSchema = yup.object({
  name: yup.string().required(),
  alternativeText: yup.string(),
  caption: yup.string(),
  folder: yup.number(),
});

interface FormData {
  name: string;
  alternativeText: string;
  caption: string;
  parent?: {
    value?: number | undefined;
    label: string;
  };
}

export const EditAssetDialog = ({
  open,
  onClose,
  asset,
  canUpdate = true,
  canCopyLink = true,
  canDownload = true,
}: EditAssetDialogProps) => {
  const { formatMessage, formatDate } = useIntl();
  const { toggleNotification } = useNotification();
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);
  const [replacementFile, setReplacementFile] = React.useState<File | undefined>();
  const [fullAsset, setFullAsset] = React.useState<CustomFile | undefined>(asset);
  const { editAsset } = useEditAsset((updatedAsset) => {
    // Reset replacement file and close dialog with updated asset data
    setReplacementFile(undefined);
    onClose(updatedAsset);
  });

  // Reset replacement file when dialog opens or asset changes
  React.useEffect(() => {
    if (open) {
      setReplacementFile(undefined);
    }
  }, [open, asset?.id]);

  // Fetch full asset data with folder information
  const { data: assetWithFolder, isLoading: isLoadingAsset } = useAsset(asset?.id, {
    enabled: open && !!asset?.id,
  });

  // Use the asset with folder data if available, otherwise use the prop asset
  const currentAsset = assetWithFolder || asset;

  // Fetch folder structure for location dropdown
  const { data: folderStructure, isLoading: isFoldersLoading } = useFolderStructure({
    enabled: open,
  });
  

  const handleSubmit = async (values: FormData) => {
    if (!currentAsset) return;
    
    // Handle folder selection - null value means root folder
    const folderData = values.parent?.value !== undefined 
      ? (values.parent.value === null ? null : { id: values.parent.value })
      : undefined;
    
    editAsset({
      asset: currentAsset,
      file: replacementFile,
      name: values.name,
      alternativeText: values.alternativeText,
      caption: values.caption,
      folder: folderData,
    });
    
    // Note: Dialog will close via the useEditAsset onSuccess callback
  };

  const handleCropFinish = (croppedFile?: File) => {
    if (croppedFile) {
      // Set the cropped file as the replacement file
      setReplacementFile(croppedFile);
      // Automatically submit the form to save the cropped image
      submitButtonRef.current?.click();
    }
  };

  const handleCropStart = () => {
    // Crop started
  };

  const handleCropCancel = () => {
    // Crop cancelled
  };

  const handleDelete = (deletedAsset?: CustomFile | null) => {
    onClose(deletedAsset);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = (bytes / Math.pow(k, i)).toFixed(2);
    const cleanedSize = parseFloat(formattedSize).toString();
    return `${cleanedSize}${sizes[i]}`;
  };

  const getFileExtension = (ext?: string): string => {
    return ext ? (ext.startsWith('.') ? ext : `.${ext}`) : '';
  };

  const formDisabled = !canUpdate;

  const handleConfirmClose = () => {
    const confirm = window.confirm(
      formatMessage({
        id: 'window.confirm.close-modal.file',
        defaultMessage: 'Are you sure? Your changes will be lost.',
      })
    );

    if (confirm) {
      onClose();
    }
  };

  // Get folder information from the asset
  const assetFolder = currentAsset?.folder;
  const activeFolderId = typeof assetFolder === 'object' && assetFolder?.id 
    ? assetFolder.id 
    : typeof assetFolder === 'number' 
    ? assetFolder 
    : undefined;
  
  
  // Find the folder in the structure to get the correct label
  const activeFolder = React.useMemo(() => {
    if (!activeFolderId || !folderStructure) return null;
    return findRecursiveFolderByValue(folderStructure, activeFolderId);
  }, [activeFolderId, folderStructure]);
  
  const initialFormData: FormData = React.useMemo(() => ({
    name: currentAsset?.name || '',
    alternativeText: currentAsset?.alternativeText || '',
    caption: currentAsset?.caption || '',
    parent: {
      value: activeFolderId ?? undefined,
      label: activeFolder?.label || folderStructure?.[0]?.label || 'Media Library',
    },
  }), [currentAsset, activeFolderId, activeFolder, folderStructure]);

  const handleClose = (values?: FormData) => {
    if (!isEqual(initialFormData, values)) {
      handleConfirmClose();
    } else {
      onClose();
    }
  };

  const isLoading = isFoldersLoading || isLoadingAsset;
  
  if (isLoading) {
    return (
      <Modal.Root open={open} onOpenChange={() => onClose()}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              {formatMessage({
                id: getTrad('modal.details.title'),
                defaultMessage: 'Details',
              })}
            </Modal.Title>
          </Modal.Header>
          <LoadingBody minHeight="60vh" justifyContent="center" paddingTop={4} paddingBottom={4}>
            <Loader>
              {formatMessage({
                id: getTrad('content.isLoading'),
                defaultMessage: 'Content is loading.',
              })}
            </Loader>
          </LoadingBody>
          <Modal.Footer>
            <Button onClick={() => handleClose()} variant="tertiary">
              {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    );
  }

  if (!currentAsset || !open) return null;

  return (
    <>
      <Modal.Root open={open} onOpenChange={() => onClose()}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              {formatMessage({
                id: getTrad('modal.details.title'),
                defaultMessage: 'Details',
              })}
            </Modal.Title>
          </Modal.Header>
          
          <Formik
            validationSchema={fileInfoSchema}
            validateOnChange={false}
            onSubmit={handleSubmit}
            initialValues={initialFormData}
            enableReinitialize={true}
          >
            {({ values, errors, handleChange, setFieldValue }) => (
              <>
                <Modal.Body>
                  <Grid.Root gap={4}>
                    {/* Left Column - Preview */}
                    <Grid.Item xs={12} col={6} direction="column" alignItems="stretch">
                      <PreviewBox
                        asset={currentAsset!}
                        canUpdate={canUpdate}
                        canCopyLink={canCopyLink}
                        canDownload={canDownload}
                        onDelete={handleDelete}
                        onCropFinish={handleCropFinish}
                        onCropStart={handleCropStart}
                        onCropCancel={handleCropCancel}
                        replacementFile={replacementFile}
                        trackedLocation="content-manager"
                      />
                    </Grid.Item>
                    
                    {/* Right Column - Form */}
                    <Grid.Item xs={12} col={6} direction="column" alignItems="stretch">
                      <Form noValidate>
                        <Flex direction="column" alignItems="stretch" gap={3}>
                          <ContextInfo
                            blocks={[
                              {
                                label: formatMessage({
                                  id: getTrad('modal.file-details.size'),
                                  defaultMessage: 'Size',
                                }),
                                value: formatFileSize(currentAsset.size || 0),
                              },
                              {
                                label: formatMessage({
                                  id: getTrad('modal.file-details.dimensions'),
                                  defaultMessage: 'Dimensions',
                                }),
                                value: currentAsset.width && currentAsset.height ? `${currentAsset.width}x${currentAsset.height}` : null,
                              },
                              {
                                label: formatMessage({
                                  id: getTrad('modal.file-details.date'),
                                  defaultMessage: 'Date',
                                }),
                                value: currentAsset.createdAt ? formatDate(new Date(currentAsset.createdAt)) : null,
                              },
                              {
                                label: formatMessage({
                                  id: getTrad('modal.file-details.extension'),
                                  defaultMessage: 'Extension',
                                }),
                                value: getFileExtension(currentAsset.ext || undefined),
                              },
                              {
                                label: formatMessage({
                                  id: getTrad('modal.file-details.id'),
                                  defaultMessage: 'Asset ID',
                                }),
                                value: currentAsset.id || null,
                              },
                            ]}
                          />

                          <Field.Root name="name" error={errors.name}>
                            <Field.Label>
                              {formatMessage({
                                id: getTrad('form.input.label.file-name'),
                                defaultMessage: 'File name',
                              })}
                            </Field.Label>
                            <TextInput
                              value={values.name}
                              onChange={handleChange}
                              disabled={formDisabled}
                            />
                            <Field.Error />
                          </Field.Root>

                          <Field.Root
                            name="alternativeText"
                            hint={formatMessage({
                              id: getTrad('form.input.description.file-alt'),
                              defaultMessage: 'This text will be displayed if the asset can\'t be shown.',
                            })}
                            error={errors.alternativeText}
                          >
                            <Field.Label>
                              {formatMessage({
                                id: getTrad('form.input.label.file-alt'),
                                defaultMessage: 'Alternative text',
                              })}
                            </Field.Label>
                            <TextInput
                              value={values.alternativeText}
                              onChange={handleChange}
                              disabled={formDisabled}
                            />
                            <Field.Hint />
                            <Field.Error />
                          </Field.Root>

                          <Field.Root name="caption" error={errors.caption}>
                            <Field.Label>
                              {formatMessage({
                                id: getTrad('form.input.label.file-caption'),
                                defaultMessage: 'Caption',
                              })}
                            </Field.Label>
                            <TextInput
                              value={values.caption}
                              onChange={handleChange}
                              disabled={formDisabled}
                            />
                          </Field.Root>

                          <Flex direction="column" alignItems="stretch" gap={1}>
                            <Field.Root name="parent" id="asset-folder">
                              <Field.Label>
                                {formatMessage({
                                  id: getTrad('form.input.label.file-location'),
                                  defaultMessage: 'Location',
                                })}
                              </Field.Label>

                              <SelectTree
                                name="parent"
                                value={values.parent}
                                options={folderStructure || []}
                                onChange={(value) => {
                                  setFieldValue('parent', value);
                                }}
                                menuPortalTarget={document.querySelector('body')}
                                inputId="asset-folder"
                                isDisabled={formDisabled}
                                error={errors?.parent}
                                ariaErrorMessage="folder-parent-error"
                              />
                            </Field.Root>
                          </Flex>
                        </Flex>

                        <VisuallyHidden>
                          <button
                            type="submit"
                            tabIndex={-1}
                            ref={submitButtonRef}
                            disabled={formDisabled}
                          >
                            {formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
                          </button>
                        </VisuallyHidden>
                      </Form>
                    </Grid.Item>
                  </Grid.Root>
                </Modal.Body>
                
                <Modal.Footer>
                  <Button type="button" onClick={() => handleClose(values)} variant="tertiary">
                    {formatMessage({ id: 'global.cancel', defaultMessage: 'Cancel' })}
                  </Button>
                  <Flex gap={2}>
                    <ReplaceMediaButton
                      onSelectMedia={(file) => setReplacementFile(file)}
                      acceptedMime={currentAsset.mime || ''}
                      disabled={formDisabled}
                      trackedLocation="upload"
                    />

                    <Button
                      type="button"
                      onClick={() => submitButtonRef.current?.click()}
                      disabled={formDisabled}
                    >
                      {formatMessage({ id: 'global.finish', defaultMessage: 'Finish' })}
                    </Button>
                  </Flex>
                </Modal.Footer>
              </>
            )}
          </Formik>
        </Modal.Content>
      </Modal.Root>

    </>
  );
};
