import * as React from 'react';
import {
  Box,
  Card,
  CardAction,
  CardBadge,
  CardBody,
  CardCheckbox,
  CardContent,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Flex,
  IconButton,
  Typography,
} from '@strapi/design-system';
import { Pencil, Trash } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { getTrad } from '../../../utils/getTrad';

const Extension = styled.span`
  text-transform: uppercase;
`;

const CardActionsContainer = styled(CardAction)`
  opacity: 0;
  z-index: 1;

  &:focus-within {
    opacity: 1;
  }
`;

const CardCheckboxWrapper = styled.div`
  z-index: 1;
`;

const CardContainer = styled(Card)`
  cursor: pointer;

  &:hover {
    ${CardActionsContainer} {
      opacity: 1;
    }
  }
`;

export interface AssetCardBaseProps {
  children?: React.ReactNode;
  extension: string;
  isSelectable?: boolean;
  name: string;
  onSelect?: () => void;
  onRemove?: () => void;
  onEdit?: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onCancel?: () => void;
  selected?: boolean;
  subtitle?: string;
  variant: 'Image' | 'Video' | 'Audio' | 'Doc' | 'Uploading';
  className?: string;
  size?: 'S' | 'M';
}

export const AssetCardBase = ({
  children,
  extension,
  isSelectable = true,
  name,
  onSelect,
  onRemove,
  onEdit,
  onCancel,
  selected = false,
  subtitle = '',
  variant = 'Image',
  className,
  size = 'M',
}: AssetCardBaseProps) => {
  const { formatMessage } = useIntl();

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onEdit) {
      onEdit(e);
    }
  };

  const handlePropagationClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <CardContainer
      className={className}
      role="button"
      height="100%"
      tabIndex={-1}
      onClick={handleClick}
    >
      <CardHeader>
        {isSelectable && (
          <CardCheckboxWrapper onClick={handlePropagationClick}>
            <CardCheckbox checked={selected} onCheckedChange={onSelect} />
          </CardCheckboxWrapper>
        )}
        {(onRemove || onEdit || onCancel) && (
          <CardActionsContainer onClick={handlePropagationClick} position="end">
            {onEdit && (
              <IconButton
                label={formatMessage({ id: getTrad('control-card.edit'), defaultMessage: 'Edit' })}
                onClick={onEdit}
              >
                <Pencil />
              </IconButton>
            )}
            {onRemove && (
              <IconButton
                label={formatMessage({
                  id: getTrad('control-card.remove-selection'),
                  defaultMessage: 'Remove from selection',
                })}
                onClick={onRemove}
              >
                <Trash />
              </IconButton>
            )}
            {onCancel && (
              <IconButton
                label={formatMessage({
                  id: getTrad('control-card.cancel'),
                  defaultMessage: 'Cancel',
                })}
                onClick={onCancel}
              >
                <Trash />
              </IconButton>
            )}
          </CardActionsContainer>
        )}
        {children}
      </CardHeader>
      <CardBody>
        <CardContent>
          <Box paddingTop={1}>
            <Typography tag="h2">
              <CardTitle tag="span">{name}</CardTitle>
            </Typography>
          </Box>
          <CardSubtitle>
            <Extension>{extension}</Extension>
            {subtitle}
          </CardSubtitle>
        </CardContent>
        <Flex paddingTop={1} grow={1}>
          <CardBadge>
            {formatMessage({
              id: getTrad(`settings.section.${variant === 'Uploading' ? 'uploading' : variant.toLowerCase()}.label`),
              defaultMessage: variant,
            })}
          </CardBadge>
        </Flex>
      </CardBody>
    </CardContainer>
  );
};