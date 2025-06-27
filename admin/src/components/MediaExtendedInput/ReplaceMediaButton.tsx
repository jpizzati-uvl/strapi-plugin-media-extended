import * as React from 'react';
import { Button, VisuallyHidden, ButtonProps } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTrad } from '../../utils/getTrad';

interface ReplaceMediaButtonProps extends ButtonProps {
  acceptedMime: string;
  onSelectMedia: (file?: File) => void;
  trackedLocation?: string;
}

export const ReplaceMediaButton = ({
  onSelectMedia,
  acceptedMime,
  trackedLocation,
  ...props
}: ReplaceMediaButtonProps) => {
  const { formatMessage } = useIntl();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleChange = () => {
    const file = inputRef.current?.files?.[0];
    onSelectMedia(file);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleClick} {...props}>
        {formatMessage({
          id: getTrad('control-card.replace-media'),
          defaultMessage: 'Replace media',
        })}
      </Button>
      <VisuallyHidden>
        <input
          accept={acceptedMime}
          type="file"
          name="file"
          data-testid="file-input"
          tabIndex={-1}
          ref={inputRef}
          onChange={handleChange}
          aria-hidden
        />
      </VisuallyHidden>
    </>
  );
};