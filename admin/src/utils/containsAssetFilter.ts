import { Query } from '../services/api';

export const containsAssetFilter = (query: Query): boolean => {
  const filters = query?.filters?.$and;
  
  if (!filters || !Array.isArray(filters)) {
    return false;
  }

  const assetFilterExists = filters.some((filter) => {
    return Object.keys(filter).some((key) => ['createdAt', 'updatedAt', 'mime', 'name'].includes(key));
  });

  return assetFilterExists;
};