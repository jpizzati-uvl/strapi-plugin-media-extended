import type { File } from './getAllowedFiles';
import { prefixFileUrlWithBackendUrl } from './prefixFileUrlWithBackendUrl';

export const createAssetUrl = (asset: File, forThumbnail = true): string => {
  if (!asset) return '';
  
  // For local/temporary files, use the raw file
  if ((asset as any).isLocal && (asset as any).rawFile) {
    return URL.createObjectURL((asset as any).rawFile);
  }
  
  // Use thumbnail format if available and requested
  const assetUrl = forThumbnail ? (asset as any).formats?.thumbnail?.url || asset.url : asset.url;
  
  if (!assetUrl) return '';
  
  const prefixedUrl = prefixFileUrlWithBackendUrl(assetUrl) || '';
  
  // Add cache-busting parameter based on updatedAt timestamp
  if (prefixedUrl && asset.updatedAt) {
    const separator = prefixedUrl.includes('?') ? '&' : '?';
    return `${prefixedUrl}${separator}updated=${new Date(asset.updatedAt).getTime()}`;
  }
  
  return prefixedUrl;
};