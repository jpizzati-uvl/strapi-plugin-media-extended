import { AssetSource, AssetType } from '../constants/index';

export interface RawFile {
  name: string;
  size: number;
  type: string;
}

export const rawFileToAsset = (file: globalThis.File, source: AssetSource) => {
  // Determine asset type from mime type
  let type: AssetType | undefined;
  if (file.type.startsWith('image/')) {
    type = 'images';
  } else if (file.type.startsWith('video/')) {
    type = 'videos';
  } else if (file.type.startsWith('audio/')) {
    type = 'audios';
  } else {
    type = 'files';
  }

  return {
    name: file.name,
    size: file.size,
    mime: file.type,
    ext: file.name.split('.').pop() || '',
    rawFile: file,
    source,
    isLocal: true,
    url: '',
    provider: 'local',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documentId: '',
    type,
  };
};