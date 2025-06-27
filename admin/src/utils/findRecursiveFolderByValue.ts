import type { OptionSelectTree } from '../components/MediaExtendedInput/SelectTree';

export const findRecursiveFolderByValue = (
  folders: OptionSelectTree[],
  value: string | number | null
): OptionSelectTree | undefined => {
  for (const folder of folders) {
    // Compare both as strings and as numbers to handle type mismatches
    if (folder.value === value || 
        (folder.value && value && folder.value.toString() === value.toString())) {
      return folder;
    }
    
    if (folder.children && folder.children.length > 0) {
      const found = findRecursiveFolderByValue(folder.children, value);
      if (found) {
        return found;
      }
    }
  }
  
  return undefined;
};