import { getTrad } from './getTrad';

const MIME_TYPES: Record<string, string> = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  mp4: 'video/mp4',
  avi: 'video/x-msvideo',
  mov: 'video/quicktime',
  wmv: 'video/x-ms-wmv',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  txt: 'text/plain',
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  ts: 'application/typescript',
};

const getFilenameFromURL = (url: string) => {
  const pathname = new URL(url).pathname;
  const parts = pathname.split('/');
  
  return parts[parts.length - 1];
};

const getMimeTypeFromFilename = (filename: string) => {
  const parts = filename.split('.');
  const ext = parts[parts.length - 1].toLowerCase();
  
  return MIME_TYPES[ext] || 'application/octet-stream';
};

interface AssetResult {
  name: string;
  url: string;
  mime: string | null;
  rawFile: File;
  isLocal: boolean;
  tempId: string;
  ext?: string;
}

export const urlsToAssets = async (urls: string[]) => {
  const assetPromises = urls.map((url) =>
    fetch(url)
      .then(async (res) => {
        const blob = await res.blob();
        const filename = getFilenameFromURL(res.url) || 'download';
        const mimeType = res.headers.get('content-type') || getMimeTypeFromFilename(filename);
        
        const loadedFile = new File([blob], filename, {
          type: mimeType || undefined,
        });

        const asset: AssetResult = {
          name: loadedFile.name,
          url: res.url,
          mime: mimeType,
          rawFile: loadedFile,
          isLocal: true,
          tempId: `url-${Date.now()}-${Math.random()}`,
          ext: filename.split('.').pop(),
        };

        return asset;
      })
      .catch((error) => {
        console.error(`Failed to fetch ${url}:`, error);
        throw new Error(
          getTrad
            ? getTrad('modal.upload.url.error')
            : `Failed to fetch ${url}`
        );
      })
  );

  const results = await Promise.allSettled(assetPromises);
  const successes: AssetResult[] = [];
  const failures: { url: string; error: string }[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successes.push(result.value);
    } else {
      failures.push({
        url: urls[index],
        error: result.reason?.message || 'Unknown error',
      });
    }
  });

  return { successes, failures };
};