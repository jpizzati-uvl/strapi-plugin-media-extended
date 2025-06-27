import * as React from 'react';
import { Box, Flex, BoxProps, CardAction } from '@strapi/design-system';
import { Folder } from '@strapi/icons';
import { styled } from 'styled-components';

const FauxClickWrapper = styled.button`
  height: 100%;
  left: 0;
  position: absolute;
  opacity: 0;
  top: 0;
  width: 100%;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const StyledFolder = styled(Folder)`
  path {
    fill: currentColor;
  }
`;

const CardActionDisplay = styled(Box)`
  display: none;
`;

const Card = styled(Box)<{ $isCardActions?: boolean }>`
  &:hover,
  &:focus-within {
    ${CardActionDisplay} {
      display: ${({ $isCardActions }) => ($isCardActions ? 'block' : '')};
    }
  }
`;

interface FolderCardProps extends Omit<BoxProps, 'id'> {
  id?: string;
  ariaLabel?: string;
  onClick: () => void;
  cardActions?: React.ReactNode;
  children: React.ReactNode;
}

export const FolderCard = ({ 
  id,
  ariaLabel,
  onClick, 
  cardActions, 
  children,
  ...props 
}: FolderCardProps) => {
  return (
    <Card position="relative" tabIndex={0} $isCardActions={!!cardActions} {...props}>
      <FauxClickWrapper
        type="button"
        onClick={onClick}
        tabIndex={-1}
        aria-label={ariaLabel}
        aria-hidden
      />

      <Flex
        hasRadius
        borderStyle="solid"
        borderWidth="1px"
        borderColor="neutral150"
        background="neutral0"
        shadow="tableShadow"
        padding={3}
        gap={2}
        cursor="pointer"
      >
        <Box
          hasRadius
          background="secondary100"
          color="secondary500"
          paddingBottom={2}
          paddingLeft={3}
          paddingRight={3}
          paddingTop={2}
        >
          <StyledFolder width="2.4rem" height="2.4rem" />
        </Box>

        {children}

        <CardActionDisplay>
          <CardAction right={4} position="end">
            {cardActions}
          </CardAction>
        </CardActionDisplay>
      </Flex>
    </Card>
  );
};