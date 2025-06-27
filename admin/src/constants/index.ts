export const PERMISSIONS = {
  main: [
    { action: 'plugin::upload.read', subject: null },
    { action: 'plugin::upload.assets.create', subject: null },
    { action: 'plugin::upload.assets.update', subject: null },
  ],
  create: [{ action: 'plugin::upload.assets.create', subject: null }],
  update: [{ action: 'plugin::upload.assets.update', subject: null }],
  download: [{ action: 'plugin::upload.assets.download', subject: null }],
  copyLink: [{ action: 'plugin::upload.assets.copy-link', subject: null }],
};

export const localStorageKeys = {
  modalView: 'STRAPI_MEDIA_LIBRARY_MODAL_VIEW',
  view: 'STRAPI_MEDIA_LIBRARY_VIEW',
};

export const viewOptions = {
  GRID: 'grid',
  LIST: 'list',
};

export const sortOptions = [
  { key: 'sort.created_at_desc', value: 'createdAt:desc' },
  { key: 'sort.created_at_asc', value: 'createdAt:asc' },
  { key: 'sort.name_asc', value: 'name:asc' },
  { key: 'sort.name_desc', value: 'name:desc' },
  { key: 'sort.updated_at_desc', value: 'updatedAt:desc' },
  { key: 'sort.updated_at_asc', value: 'updatedAt:asc' },
];

export const pageSizes = [10, 20, 50, 100];

export const ACCEPTED_ASSET_TYPES = [
  'images',
  'videos',
  'audios', 
  'files',
] as const;

export type AssetType = typeof ACCEPTED_ASSET_TYPES[number];

export const AssetSource = {
  Computer: 'computer',
  Url: 'url',
} as const;

export type AssetSource = (typeof AssetSource)[keyof typeof AssetSource];

export const AssetTypeValues = {
  Video: 'video',
  Audio: 'audio',
  Image: 'image',
} as const;

export const PLUGIN_ID = 'media-extended';

export const tableHeaders = [
  {
    name: 'preview',
    key: 'preview',
    metadatas: {
      isSortable: false,
      label: {
        id: 'media-library.table.header.preview',
        defaultMessage: 'Preview',
      },
    },
  },
  {
    name: 'name',
    key: 'name',
    metadatas: {
      isSortable: true,
      label: {
        id: 'media-library.table.header.name',
        defaultMessage: 'Name',
      },
    },
  },
  {
    name: 'ext',
    key: 'extension',
    metadatas: {
      isSortable: false,
      label: {
        id: 'media-library.table.header.ext',
        defaultMessage: 'Extension',
      },
    },
  },
  {
    name: 'size',
    key: 'size',
    metadatas: {
      isSortable: false,
      label: {
        id: 'media-library.table.header.size',
        defaultMessage: 'Size',
      },
    },
  },
  {
    name: 'createdAt',
    key: 'createdAt',
    metadatas: {
      isSortable: true,
      label: {
        id: 'media-library.table.header.createdAt',
        defaultMessage: 'Created',
      },
    },
  },
  {
    name: 'updatedAt',
    key: 'updatedAt',
    metadatas: {
      isSortable: true,
      label: {
        id: 'media-library.table.header.updatedAt',
        defaultMessage: 'Last update',
      },
    },
  },
];