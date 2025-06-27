import * as React from 'react';
import { ProgressBar, Flex, Typography } from '@strapi/design-system';
import { Cross } from '@strapi/icons';

interface UploadProgressProps {
  error?: Error | null;
  onCancel?: () => void;
  progress?: number;
}

export const UploadProgress = ({ error, onCancel, progress = 0 }: UploadProgressProps) => {
  return (
    <Flex direction="column" alignItems="center" gap={2}>
      {error ? (
        <Typography textColor="danger600">{error.message}</Typography>
      ) : (
        <>
          <ProgressBar value={progress} />
          <Typography variant="pi">{Math.round(progress)}%</Typography>
        </>
      )}
      {onCancel && (
        <button onClick={onCancel} aria-label="Cancel upload">
          <Cross />
        </button>
      )}
    </Flex>
  );
};