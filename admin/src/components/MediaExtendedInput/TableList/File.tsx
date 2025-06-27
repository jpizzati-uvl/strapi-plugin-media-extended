import { Checkbox, Flex, IconButton, Td, Tr } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';
import { useIntl } from 'react-intl';

import { getTrad } from '../../../utils/getTrad';
import { FileRow } from './TableList';
import { CellContent } from './CellContent';

interface FileProps {
  asset: FileRow;
  isSelected: boolean;
  onEditAsset: (asset: FileRow) => void;
  onSelectOne: (element: FileRow) => void;
}

export const File = ({
  asset,
  isSelected,
  onEditAsset,
  onSelectOne,
}: FileProps) => {
  const { formatMessage } = useIntl();

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Tr>
      <Td onClick={handleCheckboxClick}>
        {asset.isSelectable && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelectOne(asset)}
          />
        )}
      </Td>
      <CellContent content={asset} contentType="asset" cellType="image" />
      <CellContent content={asset} contentType="asset" cellType="text" />
      <CellContent content={asset} contentType="asset" cellType="ext" />
      <CellContent content={asset} contentType="asset" cellType="size" />
      <CellContent content={asset} contentType="asset" cellType="date" />
      <CellContent content={asset} contentType="asset" cellType="date" />
      <Td>
        <Flex justifyContent="flex-end">
          <IconButton
            label={formatMessage({
              id: getTrad('list.asset.edit'),
              defaultMessage: 'Edit asset',
            })}
            onClick={() => onEditAsset(asset)}
            variant="ghost"
          >
            <Pencil />
          </IconButton>
        </Flex>
      </Td>
    </Tr>
  );
};