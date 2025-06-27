import * as React from 'react';
import { Flex, SingleSelect, SingleSelectOption, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';

const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

interface PageSizeProps {
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
}

export const PageSize = ({ pageSize, onChangePageSize }: PageSizeProps) => {
  const { formatMessage } = useIntl();

  const handleChange = (value: string | number) => {
    onChangePageSize(typeof value === 'string' ? parseInt(value, 10) : value);
  };

  return (
    <Flex gap={2}>
      <SingleSelect
        size="S"
        aria-label={formatMessage({
          id: 'components.PageFooter.select',
          defaultMessage: 'Entries per page',
        })}
        onChange={handleChange}
        value={pageSize.toString()}
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <SingleSelectOption key={option} value={option}>
            {option}
          </SingleSelectOption>
        ))}
      </SingleSelect>
      <Typography textColor="neutral600" tag="span">
        {formatMessage({
          id: 'components.PageFooter.select',
          defaultMessage: 'Entries per page',
        })}
      </Typography>
    </Flex>
  );
};