import * as React from 'react';
import { Box, Button, Field, Flex, Typography } from '@strapi/design-system';
import { useField, type InputProps } from '@strapi/strapi/admin';

export const SimpleMediaInput = React.forwardRef<HTMLDivElement, InputProps>(
  (props, forwardedRef) => {
    const { name, label, hint, required, disabled } = props;
    const field = useField(name);

    const handleClick = () => {
      try {
        // Try to set a simple test value
        const testValue = { test: 'value', timestamp: Date.now() };
        field.onChange(name, testValue);
      } catch (error) {
        // Handle error silently
      }
    };

    return (
      <Field.Root name={name} error={field.error} hint={hint} required={required}>
        <Flex direction="column" alignItems="stretch" gap={1}>
          {label && <Field.Label>{label}</Field.Label>}
          
          <Box padding={4} background="neutral100" hasRadius>
            <Typography variant="omega">Simple Media Input</Typography>
            <Box paddingTop={2}>
              <Typography variant="pi">
                Current value: {field.value ? JSON.stringify(field.value) : 'null'}
              </Typography>
            </Box>
            <Box paddingTop={2}>
              <Button onClick={handleClick} disabled={disabled}>
                Test Set Value
              </Button>
            </Box>
          </Box>
          
          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);