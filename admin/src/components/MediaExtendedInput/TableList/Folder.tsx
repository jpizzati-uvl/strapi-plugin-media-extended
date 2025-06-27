import { Checkbox, Flex, IconButton, Td, Tr } from '@strapi/design-system';
import { Eye, Pencil } from '@strapi/icons';
import { useIntl } from 'react-intl';

import { getTrad } from '../../../utils/getTrad';
import { FolderRow } from './TableList';
import { CellContent } from './CellContent';

interface FolderProps {
  folder: FolderRow;
  isSelected: boolean;
  onChangeFolder?: ((folderId: number, folderPath?: string) => void) | null;
  onEditFolder: (folder: FolderRow) => void;
  onSelectOne: (element: FolderRow) => void;
}

export const Folder = ({
  folder,
  isSelected,
  onChangeFolder,
  onEditFolder,
  onSelectOne,
}: FolderProps) => {
  const { formatMessage } = useIntl();

  const handleClick = () => {
    if (onChangeFolder) {
      onChangeFolder(folder.id, folder.path);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Tr
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <Td onClick={handleCheckboxClick}>
        {folder.isSelectable && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelectOne(folder)}
          />
        )}
      </Td>
      <CellContent content={folder} contentType="folder" cellType="image" />
      <CellContent content={folder} contentType="folder" cellType="text" />
      <CellContent content={folder} contentType="folder" cellType="ext" />
      <CellContent content={folder} contentType="folder" cellType="size" />
      <CellContent content={folder} contentType="folder" cellType="date" />
      <CellContent content={folder} contentType="folder" cellType="date" />
      <Td onClick={(e) => e.stopPropagation()}>
        <Flex justifyContent="flex-end" gap={1}>
          {onChangeFolder && (
            <IconButton
              label={formatMessage({
                id: getTrad('list.folder.open'),
                defaultMessage: 'Open folder',
              })}
              onClick={handleClick}
              variant="ghost"
            >
              <Eye />
            </IconButton>
          )}
          <IconButton
            label={formatMessage({
              id: getTrad('list.folder.edit'),
              defaultMessage: 'Edit folder',
            })}
            onClick={() => onEditFolder(folder)}
            variant="ghost"
          >
            <Pencil />
          </IconButton>
        </Flex>
      </Td>
    </Tr>
  );
};