import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { getTrad } from './utils/getTrad';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';

// Export components for use in other plugins
export { MediaLibraryDialog } from './components/MediaExtendedInput/MediaLibraryDialog';

// eslint-disable-next-line import/no-default-export
export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      name: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
    });
    
    app.customFields.register({
      name: 'media-extended',
      pluginId: 'media-extended',
      type: 'json',
      icon: PluginIcon,
      required: true,
      intlLabel: {
        id: getTrad('media-extended.label'),
        defaultMessage: 'Media Extended',
      },
      intlDescription: {
        id: getTrad('media-extended.description'),
        defaultMessage: 'Select media files with enhanced features',
      },
      components: {
        Input: async () =>
          import('./components/MediaExtendedInput').then((module) => ({
            default: module.MediaExtendedInput,
          })),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'options.multiple',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('media-extended.options.advanced.multiple'),
                  defaultMessage: 'Multiple media',
                },
                description: {
                  id: getTrad('media-extended.options.advanced.multiple.description'),
                  defaultMessage: 'Allow selecting multiple files',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'options.allowedTypes',
                type: 'select',
                intlLabel: {
                  id: getTrad('media-extended.options.advanced.allowedTypes'),
                  defaultMessage: 'Allowed file types',
                },
                description: {
                  id: getTrad('media-extended.options.advanced.allowedTypes.description'),
                  defaultMessage: 'Select which types of files can be uploaded',
                },
                options: [
                  { value: 'images', label: 'Images' },
                  { value: 'videos', label: 'Videos' },
                  { value: 'audios', label: 'Audios' },
                  { value: 'files', label: 'Files' },
                ],
              },
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('media-extended.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('media-extended.options.advanced.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      name: 'Media Extended',
    });
  },
  
  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};