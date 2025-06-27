import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'media-extended',
    plugin: 'media-extended',
    type: 'json',
    inputSize: {
      default: 6,
      isResizable: true,
    },
  });
};