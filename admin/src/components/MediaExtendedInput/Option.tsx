import * as React from 'react';

import { Box, Flex, Typography } from '@strapi/design-system';
import { ChevronDown, ChevronUp } from '@strapi/icons';
import { components, OptionProps } from 'react-select';
import { styled } from 'styled-components';

const ToggleButton = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.2rem;
  margin-left: auto;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary200};
  }
  
  svg {
    width: 1.4rem;
    height: 1.4rem;
    
    path {
      fill: ${({ theme }) => theme.colors.neutral500};
    }
  }
`;

export const Option = (props: OptionProps<any>) => {
  const { selectProps, data } = props;
  const { maxDisplayDepth = 5, openValues, onOptionToggle } = selectProps as any;
  const { value, children: options, label, depth = 0 } = data;

  const isOpen = openValues?.includes(value);
  const hasChildren = options && options.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOptionToggle?.(value);
  };

  return (
    <components.Option {...props}>
      <Flex alignItems="start">
        <Typography textColor="neutral800" ellipsis>
          <span style={{ paddingLeft: `${Math.min(depth, maxDisplayDepth) * 14}px` }}>
            {label}
          </span>
        </Typography>
        {hasChildren && (
          <ToggleButton
            as="button"
            type="button"
            onClick={handleToggle}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </ToggleButton>
        )}
      </Flex>
    </components.Option>
  );
};