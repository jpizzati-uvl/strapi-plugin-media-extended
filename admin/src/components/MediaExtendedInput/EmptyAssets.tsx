import * as React from 'react';
import { Box, Flex, Typography } from '@strapi/design-system';
import { EmptyDocuments } from '@strapi/icons/symbols';

interface EmptyAssetsProps {
  size?: 'S' | 'M';
  count?: number;
  action?: React.ReactNode;
  content: string;
}

export const EmptyAssets = ({ size = 'M', count = 12, action, content }: EmptyAssetsProps) => {
  return (
    <Box paddingTop={8} paddingBottom={8}>
      <Flex direction="column" alignItems="center" gap={5}>
        <EmptyDocuments width="16rem" height="8.8rem" />
        <Flex direction="column" alignItems="center" gap={4}>
          <Typography variant="delta" tag="p" textColor="neutral600">
            {content}
          </Typography>
          {action}
        </Flex>
      </Flex>
    </Box>
  );
};