import { Td, Typography, Badge } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { formatBytes } from '../../../utils/formatBytes';
import { PreviewCell } from './PreviewCell';
import { FileRow, FolderRow } from './TableList';

interface CellContentProps {
  content: FileRow | FolderRow;
  contentType: 'asset' | 'folder';
  cellType: 'image' | 'text' | 'ext' | 'size' | 'date';
}

export const CellContent = ({ content, contentType, cellType }: CellContentProps) => {
  const { formatDate } = useIntl();

  switch (cellType) {
    case 'image':
      return (
        <Td>
          <PreviewCell type={contentType} content={content as any} />
        </Td>
      );

    case 'text':
      return (
        <Td>
          <Typography>{content.name}</Typography>
        </Td>
      );

    case 'ext':
      if (contentType === 'folder') {
        return (
          <Td>
            <Typography>-</Typography>
          </Td>
        );
      }

      const fileContent = content as FileRow;
      return (
        <Td>
          <Badge>{fileContent.ext?.toUpperCase()}</Badge>
        </Td>
      );

    case 'size':
      if (contentType === 'folder') {
        return (
          <Td>
            <Typography>-</Typography>
          </Td>
        );
      }

      const file = content as FileRow;
      return (
        <Td>
          <Typography>{formatBytes(file.size)}</Typography>
        </Td>
      );

    case 'date':
      if (contentType === 'folder') {
        return (
          <Td>
            <Typography>-</Typography>
          </Td>
        );
      }

      const asset = content as FileRow;
      // Use the first date for createdAt column, second call for updatedAt
      const dateValue = asset.createdAt || asset.updatedAt;
      
      if (!dateValue) {
        return (
          <Td>
            <Typography>-</Typography>
          </Td>
        );
      }

      return (
        <Td>
          <Typography>{formatDate(new Date(dateValue), { dateStyle: 'full' })}</Typography>
        </Td>
      );

    default:
      return <Td />;
  }
};