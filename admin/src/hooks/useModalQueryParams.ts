import * as React from 'react';
import { Query } from '../services/api';

interface UseModalQueryParamsOptions {
  folder?: number | null;
}

interface QueryHandlers {
  onChangeFilters?: (filters: any) => void;
  onChangePage?: (page: number) => void;
  onChangePageSize?: (pageSize: number) => void;
  onChangeSort?: (sort: string) => void;
  onChangeSearch?: (search: string) => void;
  onChangeFolder?: (folder: number | null, folderPath?: string) => void;
}

export const useModalQueryParams = (options: UseModalQueryParamsOptions = {}): [
  { queryObject: Query },
  QueryHandlers
] => {
  const [queryObject, setQueryObject] = React.useState<Query>({
    page: 1,
    pageSize: 20,
    sort: 'createdAt:desc',
    folder: options.folder,
  });

  const handlers: QueryHandlers = {
    onChangeFilters: (filters) => {
      setQueryObject((prev) => ({
        ...prev,
        filters,
        page: 1,
      }));
    },
    onChangePage: (page) => {
      setQueryObject((prev) => ({
        ...prev,
        page,
      }));
    },
    onChangePageSize: (pageSize) => {
      setQueryObject((prev) => ({
        ...prev,
        pageSize,
        page: 1,
      }));
    },
    onChangeSort: (sort) => {
      setQueryObject((prev) => ({
        ...prev,
        sort,
        page: 1,
      }));
    },
    onChangeSearch: (search) => {
      setQueryObject((prev) => ({
        ...prev,
        _q: search,
        page: 1,
      }));
    },
    onChangeFolder: (folder, folderPath) => {
      setQueryObject((prev) => ({
        ...prev,
        folder,
        folderPath,
        page: 1,
      }));
    },
  };

  return [{ queryObject }, handlers];
};