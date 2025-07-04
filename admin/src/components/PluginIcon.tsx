import { Flex } from '@strapi/design-system';
import { Image } from '@strapi/icons';
import { styled } from 'styled-components';

const IconBox = styled(Flex)`
  /* Hard code color values */
  /* to stay consistent between themes */
  background-color: #f0f0ff; /* primary100 */
  border: 1px solid #d9d8ff; /* primary200 */

  svg > path {
    fill: #4945ff; /* primary600 */
  }
`;

export const PluginIcon = () => {
  return (
    <IconBox justifyContent="center" alignItems="center" width={7} height={6} hasRadius aria-hidden>
      <Image style={{
        width: '13px !important',
        height: '11px !important'
      }}/>
    </IconBox>
  );
};