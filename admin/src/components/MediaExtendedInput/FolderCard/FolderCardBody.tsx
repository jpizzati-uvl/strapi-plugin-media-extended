import * as React from 'react';
import { Box } from '@strapi/design-system';
import { styled } from 'styled-components';

const StyledBox = styled(Box)`
  flex: 1;
  flex-shrink: 0;
`;

interface FolderCardBodyProps {
  children: React.ReactNode;
}

export const FolderCardBody = ({ children }: FolderCardBodyProps) => {
  return <StyledBox>{children}</StyledBox>;
};