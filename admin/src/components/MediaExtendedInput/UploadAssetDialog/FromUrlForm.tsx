import * as React from 'react';
import { Box, Button, Field, Flex, Modal, Textarea } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useNotification } from '@strapi/admin/strapi-admin';

import { getTrad } from '../../../utils/getTrad';
import { urlsToAssets } from '../../../utils/urlsToAssets';
import { FileWithRawFile } from './AddAssetStep';

interface FromUrlFormProps {
  onClose: () => void;
  onAddAsset: (assets: FileWithRawFile[]) => void;
  trackedLocation?: string;
}

export const FromUrlForm = ({ onClose, onAddAsset }: FromUrlFormProps) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const [urlInput, setUrlInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!urlInput.trim()) return;

    setIsLoading(true);
    try {
      const urls = urlInput
        .split(/\r?\n/)
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const { successes, failures } = await urlsToAssets(urls);

      if (failures.length > 0) {
        toggleNotification({
          type: 'warning',
          message: formatMessage(
            {
              id: getTrad('modal.upload.from-url.error-plural'),
              defaultMessage: '{count} URL(s) failed to load',
            },
            { count: failures.length }
          ),
        });
      }

      if (successes.length > 0) {
        const assets: FileWithRawFile[] = successes.map(asset => ({
          ...asset,
          mime: asset.mime || undefined,
        }));
        onAddAsset(assets);
      }
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: formatMessage({
          id: getTrad('modal.upload.from-url.error'),
          defaultMessage: 'Failed to load URLs',
        }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal.Body>
        <Box paddingLeft={8} paddingRight={8} paddingTop={6} paddingBottom={6}>
          <Field.Root 
            name="urls"
            hint={formatMessage({
              id: getTrad('modal.upload.from-url.input-hint'),
              defaultMessage: 'Separate your URL links by a carriage return.',
            })}
          >
            <Field.Label>
              {formatMessage({
                id: getTrad('modal.upload.from-url.input-label'),
                defaultMessage: 'URL',
              })}
            </Field.Label>
            <Textarea
              placeholder={formatMessage({
                id: getTrad('modal.upload.from-url.input-placeholder'),
                defaultMessage: 'https://example.com/image.png\nhttps://example.com/file.pdf',
              })}
              value={urlInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUrlInput(e.target.value)}
            />
            <Field.Hint />
          </Field.Root>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} variant="tertiary">
          {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        </Button>
        <Button 
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!urlInput.trim()}
        >
          {formatMessage({
            id: getTrad('modal.upload.from-url.button'),
            defaultMessage: 'Add from URL',
          })}
        </Button>
      </Modal.Footer>
    </>
  );
};