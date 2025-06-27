import * as React from 'react';
import { Grid, KeyboardNavigable, Box, Typography } from '@strapi/design-system';
import { styled } from 'styled-components';
import { File } from '../../utils/getAllowedFiles';
import { AssetCard } from './AssetCard';

interface AssetGridListProps {
  assets: File[];
  selectedAssets: File[];
  onSelectAsset: (asset: File) => void;
  onEditAsset?: (asset: File) => void;
  onRemoveAsset?: (asset: File) => void;
  size?: 'S' | 'M';
  onReorderAsset?: (fromIndex: number, toIndex: number) => void;
  title?: string | false;
  allowedTypes?: any[];
}

const GridItemWrapper = styled(Grid.Item)<{ $isDragging?: boolean }>`
  opacity: ${({ $isDragging }) => ($isDragging ? 0.2 : 1)};
`;

export const AssetGridList = ({
  assets,
  selectedAssets,
  onSelectAsset,
  onEditAsset,
  onRemoveAsset,
  size = 'M',
  onReorderAsset,
  title,
  allowedTypes,
}: AssetGridListProps) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderAsset) {
      onReorderAsset(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const cols = 3;

  return (
    <>
      {title && (
        <Box paddingBottom={4}>
          <Typography tag="h2" variant="delta" fontWeight="semiBold">
            {title}
          </Typography>
        </Box>
      )}
      <KeyboardNavigable tagName="div">
        <Grid.Root gap={4}>
        {assets.map((asset, index) => {
          const isSelected = selectedAssets.some((selected) => selected.id === asset.id);
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <GridItemWrapper
              key={asset.id}
              col={cols}
              height="100%"
              direction="column"
              alignItems="stretch"
              $isDragging={isDragging}
              draggable={!!onReorderAsset}
              onDragStart={(e: React.DragEvent) => handleDragStart(e, index)}
              onDragOver={(e: React.DragEvent) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e: React.DragEvent) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                cursor: onReorderAsset ? 'move' : 'default',
                border: isDragOver ? '2px dashed #4945ff' : 'none',
                borderRadius: '4px',
                padding: isDragOver ? '2px' : '0',
              }}
            >
              <AssetCard
                asset={asset}
                isSelected={isSelected}
                onSelect={() => onSelectAsset(asset)}
                onEdit={onEditAsset ? () => onEditAsset(asset) : undefined}
                onRemove={onRemoveAsset ? () => onRemoveAsset(asset) : undefined}
                size={size}
              />
            </GridItemWrapper>
          );
        })}
        </Grid.Root>
      </KeyboardNavigable>
    </>
  );
};