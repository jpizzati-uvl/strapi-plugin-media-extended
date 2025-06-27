import * as React from 'react';
import { Button, Popover, Box, Typography } from '@strapi/design-system';
import { Filter } from '@strapi/icons';
import { useIntl } from 'react-intl';

export interface FilterStructure {
  [key: string]: any;
}

interface FiltersProps {
  appliedFilters?: FilterStructure[];
  onChangeFilters: (filters: any) => void;
}

export const Filters = ({ appliedFilters, onChangeFilters }: FiltersProps) => {
  const [open, setOpen] = React.useState(false);
  const { formatMessage } = useIntl();

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button variant="tertiary" startIcon={<Filter />} size="S">
          {formatMessage({ id: 'app.utils.filters', defaultMessage: 'Filters' })}
        </Button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="start" sideOffset={4}>
        <Box padding={3}>
          <Typography>Filters not implemented yet</Typography>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
};