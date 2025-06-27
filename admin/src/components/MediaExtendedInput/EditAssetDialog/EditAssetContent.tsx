import * as React from 'react';
import {
  Modal,
  Button,
  Box,
  Flex,
  Typography,
  Field,
  TextInput,
  Textarea,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import { getTrad } from '../../../utils/getTrad';
import { Asset } from '../UploadAssetDialog/UploadAssetDialog';

interface EditAssetContentProps {
  onClose: (asset?: Asset) => void;
  asset: Asset;
  canUpdate: boolean;
}

const schema = yup.object({
  name: yup.string().required(),
  alternativeText: yup.string(),
  caption: yup.string(),
});

export const EditAssetContent = ({
  onClose,
  asset,
  canUpdate,
}: EditAssetContentProps) => {
  const { formatMessage } = useIntl();

  const handleSubmit = (values: any) => {
    const nextAsset: Asset = {
      ...asset,
      name: values.name,
      alternativeText: values.alternativeText || null,
      caption: values.caption || null,
    };

    onClose(nextAsset);
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>
          {formatMessage({
            id: getTrad('modal.edit.title'),
            defaultMessage: 'Edit asset',
          })}
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{
          name: asset.name,
          alternativeText: asset.alternativeText || '',
          caption: asset.caption || '',
        }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ values, handleChange, errors, touched, handleBlur }) => (
          <Form>
            <Modal.Body>
              <Box paddingTop={4} paddingBottom={4}>
                <Flex direction="column" gap={5}>
                  <Field.Root
                    name="name"
                    error={touched.name && errors.name ? errors.name : undefined}
                    required
                  >
                    <Field.Label>
                      {formatMessage({
                        id: getTrad('form.input.label.file-name'),
                        defaultMessage: 'File name',
                      })}
                    </Field.Label>
                    <TextInput
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!canUpdate}
                    />
                    <Field.Error />
                  </Field.Root>

                  <Field.Root
                    name="alternativeText"
                    error={touched.alternativeText && errors.alternativeText ? errors.alternativeText : undefined}
                  >
                    <Field.Label>
                      {formatMessage({
                        id: getTrad('form.input.label.alt-text'),
                        defaultMessage: 'Alternative text',
                      })}
                    </Field.Label>
                    <Textarea
                      name="alternativeText"
                      value={values.alternativeText}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!canUpdate}
                    />
                    <Field.Error />
                  </Field.Root>

                  <Field.Root
                    name="caption"
                    error={touched.caption && errors.caption ? errors.caption : undefined}
                  >
                    <Field.Label>
                      {formatMessage({
                        id: getTrad('form.input.label.caption'),
                        defaultMessage: 'Caption',
                      })}
                    </Field.Label>
                    <Textarea
                      name="caption"
                      value={values.caption}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!canUpdate}
                    />
                    <Field.Error />
                  </Field.Root>
                </Flex>
              </Box>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={() => onClose()} variant="tertiary">
                {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
              </Button>
              {canUpdate && (
                <Button type="submit">
                  {formatMessage({ id: 'global.finish', defaultMessage: 'Finish' })}
                </Button>
              )}
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </>
  );
};