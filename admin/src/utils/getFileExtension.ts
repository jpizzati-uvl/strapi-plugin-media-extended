export const getFileExtension = (ext?: string): string => {
  return ext?.replace('.', '').toUpperCase() || 'FILE';
};