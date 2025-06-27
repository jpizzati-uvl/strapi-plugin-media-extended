import * as React from 'react';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { File } from '../utils/getAllowedFiles';

export interface Folder {
  id: number;
  documentId: string;
  name: string;
  pathId: number;
  path: string;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: number;
    documentId: string;
    name: string;
    path?: string;
  } | number;
  children?: {
    count: number;
  };
  files?: {
    count: number;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface Query {
  folder?: number | null;
  folderPath?: string;
  _q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  filters?: any;
  populate?: any;
}

export interface GetFilesResponse {
  results: File[];
  pagination: Pagination;
}

export interface GetFoldersResponse {
  data: Folder[];
}

// Hook to create API service
export const useMediaLibraryApi = () => {
  const { get, post, put, del } = useFetchClient();

  const getFiles = React.useCallback(async (query: Query): Promise<GetFilesResponse> => {
    try {
      // Ensure we populate the folder relation by default (like Strapi does)
      const defaultPopulate = { folder: true };
      const params = {
        ...query,
        populate: query.populate ? { ...defaultPopulate, ...query.populate } : defaultPopulate,
      };
      const { data } = await get('/upload/files', { params });
      return data;
    } catch (error) {
      console.error('Error fetching files:', error);
      return { results: [], pagination: { page: 1, pageSize: 20, pageCount: 0, total: 0 } };
    }
  }, [get]);

  const getFolders = React.useCallback(async (query: Query): Promise<Folder[]> => {
    try {
      const { data: { data } } = await get<GetFoldersResponse>('/upload/folders', { params: query });
      return data;
    } catch (error) {
      console.error('Error fetching folders:', error);
      return [];
    }
  }, [get]);

  const getFolderStructure = React.useCallback(async (): Promise<any> => {
    try {
      const response = await get('/upload/folder-structure');
      // The response might be wrapped in data property
      return response.data || response;
    } catch (error) {
      console.error('Error fetching folder structure:', error);
      return [];
    }
  }, [get]);

  const uploadFiles = React.useCallback(async (files: FormData): Promise<File[]> => {
    try {
      const { data } = await post('/upload', files);
      return data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }, [post]);

  const updateFile = React.useCallback(async (id: string | number, data: Partial<File>): Promise<File> => {
    const { data: file } = await put(`/upload/files/${id}`, data);
    return file;
  }, [put]);

  const deleteFile = React.useCallback(async (id: string | number): Promise<void> => {
    await del(`/upload/files/${id}`);
  }, [del]);

  const createFolder = React.useCallback(async (data: { name: string; parent?: number | null }): Promise<Folder> => {
    const response = await post('/upload/folders', data);
    return response.data;
  }, [post]);

  const updateFolder = React.useCallback(async (id: string | number, data: Partial<Folder>): Promise<Folder> => {
    const response = await put(`/upload/folders/${id}`, data);
    return response.data;
  }, [put]);

  return {
    getFiles,
    getFolders,
    getFolderStructure,
    uploadFiles,
    updateFile,
    deleteFile,
    createFolder,
    updateFolder,
  };
};