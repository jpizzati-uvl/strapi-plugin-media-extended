import * as React from 'react';
import { Box, Button, Flex, Modal, Typography } from '@strapi/design-system';
import { PlusCircle } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import { getTrad } from '../../../utils/getTrad';
import { FileWithRawFile } from './AddAssetStep';

const MediaBox = styled(Box)<{ $dragOver?: boolean }>`
  border-style: dashed;
  border-color: ${({ theme, $dragOver }) => $dragOver ? theme.colors.primary500 : theme.colors.neutral300};
  border-width: 1px;
  background: ${({ theme, $dragOver }) => $dragOver ? theme.colors.primary100 : theme.colors.neutral100};
  cursor: pointer;
`;

const OpaqueBox = styled(Box)`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

interface FromComputerFormProps {
  onClose: () => void;
  onAddAssets: (assets: FileWithRawFile[]) => void;
  trackedLocation?: string;
}

export const FromComputerForm = ({ onClose, onAddAssets }: FromComputerFormProps) => {
  const { formatMessage } = useIntl();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newAssets: FileWithRawFile[] = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      mime: file.type,
      ext: file.name.split('.').pop() || '',
      rawFile: file,
      isLocal: true,
      tempId: `${Date.now()}-${Math.random()}`,
    }));

    onAddAssets(newAssets);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  return (
    <>
      <Modal.Body>
        <Box paddingLeft={8} paddingRight={8} paddingTop={6} paddingBottom={6}>
          <MediaBox
            position="relative"
            paddingTop={11}
            paddingBottom={11}
            paddingLeft={8}
            paddingRight={8}
            background={dragOver ? 'primary100' : 'neutral100'}
            borderColor={dragOver ? 'primary500' : 'neutral300'}
            borderRadius="borderRadius"
            $dragOver={dragOver}
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Flex direction="column" alignItems="center" gap={6}>
              <PlusCircle width="3.2rem" height="3.2rem" />
              <Flex direction="column" alignItems="center" gap={2}>
                <Typography variant="delta" tag="span">
                  {formatMessage({
                    id: getTrad('modal.upload.drag-drop'),
                    defaultMessage: 'Drag & Drop here or',
                  })}
                </Typography>
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  {formatMessage({
                    id: getTrad('modal.upload.browse-files'),
                    defaultMessage: 'Browse files',
                  })}
                </Button>
              </Flex>
            </Flex>
            <OpaqueBox tag="label">
              <VisuallyHidden>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  name="files"
                  tabIndex={-1}
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </VisuallyHidden>
            </OpaqueBox>
          </MediaBox>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} variant="tertiary">
          {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        </Button>
      </Modal.Footer>
    </>
  );
};