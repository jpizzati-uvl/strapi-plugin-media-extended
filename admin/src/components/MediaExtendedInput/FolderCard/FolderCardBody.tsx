import { Flex, FlexProps } from '@strapi/design-system';
import { styled } from 'styled-components';

const StyledBox = styled(Flex)`
  user-select: none;
`;

export const FolderCardBody = (props: FlexProps) => {
  return (
    <StyledBox
      {...props}
      alignItems="flex-start"
      direction="column"
      maxWidth="100%"
      overflow="hidden"
      position="relative"
    />
  );
};
