export const toSingularTypes = (types: string[]): string[] => {
  if (!Array.isArray(types)) {
    return [];
  }

  return types.map((type) => {
    switch (type) {
      case 'images':
        return 'image';
      case 'videos':
        return 'video';
      case 'files':
        return 'file';
      case 'audios':
        return 'audio';
      default:
        return type;
    }
  });
};