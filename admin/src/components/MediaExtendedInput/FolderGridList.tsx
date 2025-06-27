import * as React from 'react';
import { Box, Grid, Typography } from '@strapi/design-system';

interface FolderGridListProps {
  children: React.ReactNode;
  title?: string | false;
}

export const FolderGridList = ({ children, title }: FolderGridListProps) => {
  return (
    <>
      {title && (
        <Box>
          <Typography tag="h2" variant="delta" fontWeight="semiBold">
            {title}
          </Typography>
        </Box>
      )}
      <Box paddingTop={title ? 4 : 0}>
        <Grid.Root gap={4}>
          {children}
        </Grid.Root>
      </Box>
    </>
  );
};