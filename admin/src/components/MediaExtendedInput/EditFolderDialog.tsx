import * as React from 'react';
import { Modal, Button, Grid, Field, TextInput, Flex, Loader } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useNotification, useFetchClient } from '@strapi/admin/strapi-admin';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import { getTrad } from '../../utils/getTrad';
import { SelectTree } from './SelectTree';
import { useFolderStructure } from '../../hooks/useFolderStructure';
import { PLUGIN_ID } from '../../pluginId';

const schema = yup.object({
  name: yup.string().required(),
  parent: yup.object({
    value: yup.number().nullable(),
    label: yup.string(),
  }).nullable(),
});

interface EditFolderDialogProps {
  open: boolean;
  onClose: () => void;
  parentFolderId?: number | null;
  folder?: {
    id: number;
    name: string;
    parent?: number | null;
  } | null;
}

export const EditFolderDialog = ({
  open,
  onClose,
  parentFolderId,
  folder,
}: EditFolderDialogProps) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const queryClient = useQueryClient();
  const { post, put } = useFetchClient();
  
  const { data: folderStructure, isLoading: isFolderStructureLoading } = useFolderStructure({
    enabled: open,
  });

  const isEditing = !!folder;

  const { mutate: submitFolder, isLoading: isSubmitting } = useMutation(
    async (values: { name: string; parent: { value: number | null } | null }) => {
      const data = {
        name: values.name,
        parent: values.parent?.value || null,
      };

      if (isEditing) {
        const response = await put(`/upload/folders/${folder.id}`, data);
        return response.data;
      } else {
        const response = await post('/upload/folders', data);
        return response.data;
      }
    },
    {
      onSuccess() {
        queryClient.refetchQueries([PLUGIN_ID, 'folders']);
        queryClient.refetchQueries([PLUGIN_ID, 'folder-structure']);
        
        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: getTrad(isEditing ? 'modal.folder.edit.success' : 'modal.folder.create.success'),
            defaultMessage: isEditing ? 'Folder updated' : 'Folder created',
          }),
        });
        
        onClose();
      },
      onError() {
        toggleNotification({
          type: 'danger',
          message: formatMessage({
            id: 'notification.error',
            defaultMessage: 'An error occurred',
          }),
        });
      },
    }
  );

  const initialValues = {
    name: folder?.name || '',
    parent: parentFolderId
      ? {
          value: parentFolderId,
          label: folderStructure
            ? folderStructure.find((f: any) => f.value === parentFolderId)?.label || 'Media Library'
            : 'Media Library',
        }
      : {
          value: null,
          label: 'Media Library',
        },
  };

  if (!open) return null;

  return (
    <Modal.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            {formatMessage({
              id: getTrad(isEditing ? 'modal.folder.edit.title' : 'modal.folder.create.title'),
              defaultMessage: isEditing ? 'Edit folder' : 'Create new folder',
            })}
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={initialValues}
          onSubmit={submitFolder}
          validationSchema={schema}
          validateOnChange={false}
        >
          {({ values, errors, handleChange, setFieldValue, isSubmitting: isFormSubmitting }) => (
            <Form noValidate>
              <Modal.Body>
                {isFolderStructureLoading ? (
                  <Flex justifyContent="center" paddingTop={4} paddingBottom={4}>
                    <Loader>
                      {formatMessage({
                        id: getTrad('content.isLoading'),
                        defaultMessage: 'Content is loading.',
                      })}
                    </Loader>
                  </Flex>
                ) : (
                  <Grid.Root gap={4}>
                    <Grid.Item col={6} s={12} xs={12}>
                      <Field.Root name="name" error={errors.name} style={{ width: '100%'}}>
                        <Field.Label>
                          {formatMessage({
                            id: getTrad('form.input.label.folder-name'),
                            defaultMessage: 'Name',
                          })}
                        </Field.Label>
                        <TextInput
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <Field.Error />
                      </Field.Root>
                    </Grid.Item>

                    <Grid.Item col={6} s={12} xs={12}>
                      <Field.Root name="parent" style={{ width: '100%'}}>
                        <Field.Label>
                          {formatMessage({
                            id: getTrad('form.input.label.folder-location'),
                            defaultMessage: 'Location',
                          })}
                        </Field.Label>
                        <SelectTree
                          name="parent"
                          value={values.parent}
                          options={folderStructure || []}
                          onChange={(value) => setFieldValue('parent', value)}
                          menuPortalTarget={document.querySelector('body')}
                          inputId="folder-parent"
                          disabled={isSubmitting}
                        />
                      </Field.Root>
                    </Grid.Item>
                  </Grid.Root>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={onClose} variant="tertiary">
                  {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
                </Button>
                <Button type="submit" disabled={isSubmitting || isFolderStructureLoading}>
                  {formatMessage({
                    id: isEditing ? 'modal.folder.edit.submit' : 'modal.folder.create.submit',
                    defaultMessage: isEditing ? 'Save' : 'Create',
                  })}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Content>
    </Modal.Root>
  );
};