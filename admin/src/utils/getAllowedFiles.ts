import { toSingularTypes } from './toSingularTypes';

export interface File {
  id: string | number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, any> | null;
  hash: string;
  ext?: string | null;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  isSelectable?: boolean;
  type?: string;
  folderPath?: string;
  folder?: {
    id: number;
    name: string;
    documentId?: string;
    path?: string;
  } | number;
}

export interface AllowedFiles extends File {
  isSelectable: boolean;
  locale: string | null;
  type: string;
}

export const getAllowedFiles = (pluralTypes: string[] | null, files: AllowedFiles[]) => {
  if (!pluralTypes) {
    return files;
  }

  const singularTypes = toSingularTypes(pluralTypes);

  const allowedFiles = files.filter((file) => {
    const fileType = file?.mime?.split('/')[0];

    if (!fileType) {
      return false;
    }

    if (singularTypes.includes('file') && !['video', 'image', 'audio'].includes(fileType)) {
      return true;
    }

    return singularTypes.includes(fileType);
  });

  return allowedFiles;
};