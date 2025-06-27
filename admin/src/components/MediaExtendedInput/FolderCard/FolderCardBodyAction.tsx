import * as React from 'react';
import { Box } from '@strapi/design-system';
import { styled } from 'styled-components';

const BoxOutline = styled(Box)`
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary600};
    outline-offset: -2px;
  }
`;

interface FolderCardBodyActionProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const FolderCardBodyAction = ({ children, onClick }: FolderCardBodyActionProps) => {
  return (
    <BoxOutline
      padding={1}
      tag="button"
      type="button"
      onClick={onClick}
      hasRadius
      background="transparent"
      borderColor="transparent"
    >
      {children}
    </BoxOutline>
  );
};