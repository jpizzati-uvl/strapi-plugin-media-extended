# Strapi Plugin Media Extended

A Strapi plugin that provides an extended media field with enhanced features for file selection and upload.

## Features

- 🎨 Custom media field type for Strapi plugins
- 📁 Support for single and multiple file selection
- 🎯 File type filtering (images, videos, audios, files)
- 🖼️ Image preview with carousel navigation
- 📂 Full media library dialog with folder navigation
- ⬆️ Drag and drop file upload
- 🔍 Search and filter capabilities
- 📱 Responsive and user-friendly interface
- 🌐 Internationalization support
- ✨ 1:1 experience with native Strapi media field

## Installation

```bash
npm install strapi-plugin-media-extended
# or
yarn add strapi-plugin-media-extended
```

## Usage

### 1. Enable the plugin

In your Strapi project, the plugin should be automatically detected. If not, add it to your `config/plugins.js`:

```javascript
module.exports = {
  'media-extended': {
    enabled: true,
  },
};
```

### 2. Use in your custom fields

In your plugin's custom field registration:

```typescript
app.customFields.register({
  name: 'my-media-field',
  pluginId: 'my-plugin',
  type: 'media-extended',
  intlLabel: {
    id: 'my-plugin.field.label',
    defaultMessage: 'My Media Field',
  },
  intlDescription: {
    id: 'my-plugin.field.description',
    defaultMessage: 'Select media files',
  },
  components: {
    Input: async () => import('strapi-plugin-media-extended').then(mod => mod.MediaExtendedInput),
  },
});
```

### 3. Configure field options

The media-extended field supports the following options:

- **multiple** (boolean): Allow selecting multiple files
- **allowedTypes** (array): Restrict file types ['images', 'videos', 'audios', 'files']
- **required** (boolean): Make the field required

## Field Configuration

When using the media-extended field in your content types:

```json
{
  "myMediaField": {
    "type": "media-extended",
    "multiple": true,
    "allowedTypes": ["images", "videos"],
    "required": false
  }
}
```

## Development

### Building the plugin

```bash
npm run build
# or for development with watch mode
npm run watch
```

### Project Structure

```
strapi-plugin-media-extended/
├── admin/           # Admin panel code
│   └── src/
│       ├── components/     # React components
│       ├── translations/   # i18n files
│       └── index.ts       # Plugin registration
├── server/          # Server-side code
│   └── src/
│       ├── register.ts    # Custom field registration
│       └── index.ts
├── dist/            # Built files
└── package.json
```

## API

### MediaExtendedInput Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `name` | string | Field name | required |
| `label` | string | Field label | - |
| `hint` | string | Help text | - |
| `required` | boolean | Is field required | false |
| `disabled` | boolean | Is field disabled | false |
| `attribute` | object | Field configuration | {} |
| `attribute.multiple` | boolean | Allow multiple selection | false |
| `attribute.allowedTypes` | array | Allowed file types | null |

### Allowed File Types

- `images`: JPEG, PNG, GIF, SVG, TIFF, ICO, DVU
- `videos`: MPEG, MP4, Quicktime, WMV, AVI, FLV
- `audios`: MP3, WAV, OGG
- `files`: CSV, ZIP, PDF, Excel, JSON, etc.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

- [GitHub Issues](https://github.com/yourusername/strapi-plugin-media-extended/issues)
- [Strapi Community Forum](https://forum.strapi.io/)

## Changelog

### 1.0.0
- Initial release
- Basic media field functionality
- Support for single/multiple selection
- File type filtering