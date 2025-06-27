import { Box, Divider, Modal, Tabs } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { getTrad } from '../../../utils/getTrad';

import { FromComputerForm } from './FromComputerForm';
import { FromUrlForm } from './FromUrlForm';

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
}

interface AddAssetStepProps {
  onClose: () => void;
  onAddAsset: (assets: FileWithRawFile[]) => void;
  trackedLocation?: string;
}

export const AddAssetStep = ({ onClose, onAddAsset, trackedLocation }: AddAssetStepProps) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Modal.Header>
        <Modal.Title>
          {formatMessage({
            id: getTrad('header.actions.add-assets'),
            defaultMessage: 'Add new assets',
          })}
        </Modal.Title>
      </Modal.Header>
      <Tabs.Root variant="simple" defaultValue="computer">
        <Box paddingLeft={8} paddingRight={8} paddingTop={6}>
          <Tabs.List
            aria-label={formatMessage({
              id: getTrad('tabs.title'),
              defaultMessage: 'How do you want to upload your assets?',
            })}
          >
            <Tabs.Trigger value="computer">
              {formatMessage({
                id: getTrad('modal.nav.computer'),
                defaultMessage: 'From computer',
              })}
            </Tabs.Trigger>
            <Tabs.Trigger value="url">
              {formatMessage({
                id: getTrad('modal.nav.url'),
                defaultMessage: 'From URL',
              })}
            </Tabs.Trigger>
          </Tabs.List>

          <Divider />
        </Box>
        <Tabs.Content value="computer">
          <FromComputerForm
            onClose={onClose}
            onAddAssets={onAddAsset}
            trackedLocation={trackedLocation}
          />
        </Tabs.Content>
        <Tabs.Content value="url">
          <FromUrlForm
            onClose={onClose}
            onAddAsset={onAddAsset}
            trackedLocation={trackedLocation}
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};