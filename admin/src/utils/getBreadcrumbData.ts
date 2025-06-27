import { getTrad } from './getTrad';
import { Folder } from '../services/api';
import type { MessageDescriptor } from 'react-intl';

interface BreadcrumbItem {
  id?: number | null;
  label?: MessageDescriptor | string;
  path?: string;
}

type BreadcrumbData = BreadcrumbItem;

export const getBreadcrumbData = (folder: Folder | null): BreadcrumbData[] => {
  const data: BreadcrumbData[] = [
    {
      id: null,
      label: { id: getTrad('plugin.name'), defaultMessage: 'Media Library' },
    },
  ];

  // Add parent folders
  if (folder?.parent && typeof folder.parent !== 'number') {
    // If there's a grandparent, we might want to add ... menu in future
    // For now, just add the parent
    data.push({
      id: folder.parent.id,
      label: folder.parent.name,
      path: folder.parent.path,
    });
  }

  // Add current folder
  if (folder) {
    data.push({
      id: folder.id,
      label: folder.name,
      path: folder.path,
    });
  }

  return data;
};