import * as React from 'react';
import { SingleSelect, SingleSelectOption, Field } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTrad } from '../../utils/getTrad';

const sortOptions = [
  { key: 'sort.created_at_desc', value: 'createdAt:desc', label: 'Most recent uploads' },
  { key: 'sort.created_at_asc', value: 'createdAt:asc', label: 'Oldest uploads' },
  { key: 'sort.name_asc', value: 'name:asc', label: 'Alphabetical order (A to Z)' },
  { key: 'sort.name_desc', value: 'name:desc', label: 'Reverse alphabetical order (Z to A)' },
  { key: 'sort.updated_at_desc', value: 'updatedAt:desc', label: 'Recently updated' },
  { key: 'sort.updated_at_asc', value: 'updatedAt:asc', label: 'Oldest updated' },
];

interface SortPickerProps {
  onChangeSort: (value: string | number) => void;
  value?: string;
}

export const SortPicker = ({ onChangeSort, value }: SortPickerProps) => {
  const { formatMessage } = useIntl();

  return (
    <SingleSelect
      size="S"
      value={value || 'name:asc'}
      onChange={onChangeSort}
      aria-label={formatMessage({
        id: getTrad('sort.label'),
        defaultMessage: 'Sort by',
      })}
    >
      {sortOptions.map((option) => (
        <SingleSelectOption key={option.key} value={option.value}>
          {formatMessage({
            id: getTrad(option.key),
            defaultMessage: option.label,
          })}
        </SingleSelectOption>
      ))}
    </SingleSelect>
  );
};