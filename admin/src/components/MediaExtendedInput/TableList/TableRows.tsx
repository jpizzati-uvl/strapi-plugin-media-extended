import { Tbody } from '@strapi/design-system';

import { FolderRow, FileRow } from './TableList';
import { File } from './File';
import { Folder } from './Folder';

interface TableRowsProps {
  onChangeFolder?: ((folderId: number, folderPath?: string) => void) | null;
  onEditAsset: (asset: FileRow) => void;
  onEditFolder: (folder: FolderRow) => void;
  onSelectOne: (element: FileRow | FolderRow) => void;
  rows?: FileRow[] | FolderRow[];
  selected?: FileRow[] | FolderRow[];
}

export const TableRows = ({
  onChangeFolder,
  onEditAsset,
  onEditFolder,
  onSelectOne,
  rows = [],
  selected = [],
}: TableRowsProps) => {
  return (
    <Tbody>
      {rows.map((row) => {
        const isSelected = selected.some((selectedRow) => {
          if (selectedRow.type === 'folder' && row.type === 'folder') {
            return selectedRow.id === row.id;
          }

          if (selectedRow.type === 'asset' && row.type === 'asset') {
            return selectedRow.id === row.id;
          }

          return false;
        });

        if (row.type === 'folder') {
          return (
            <Folder
              key={`folder-${row.id}`}
              folder={row as FolderRow}
              isSelected={isSelected}
              onChangeFolder={onChangeFolder}
              onEditFolder={onEditFolder}
              onSelectOne={onSelectOne}
            />
          );
        }

        return (
          <File
            key={`asset-${row.id}`}
            asset={row as FileRow}
            isSelected={isSelected}
            onEditAsset={onEditAsset}
            onSelectOne={onSelectOne}
          />
        );
      })}
    </Tbody>
  );
};