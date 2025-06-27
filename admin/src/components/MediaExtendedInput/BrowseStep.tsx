import * as React from 'react';
import {
  Box,
  Flex,
  Grid,
  Typography,
  Checkbox,
  IconButton,
  Divider,
  Button,
  VisuallyHidden,
} from '@strapi/design-system';
import { GridFour as GridIcon, List, Pencil, Plus } from '@strapi/icons';
import { styled } from 'styled-components';
import { useIntl } from 'react-intl';
import { File } from '../../utils/getAllowedFiles';
import { Folder, Query } from '../../services/api';
import { AssetGridList } from './AssetGridList';
import { FolderCard } from './FolderCard/FolderCard';
import { FolderCardBody } from './FolderCard/FolderCardBody';
import { FolderCardBodyAction } from './FolderCard/FolderCardBodyAction';
import { FolderGridList } from './FolderGridList';
import { getTrad } from '../../utils/getTrad';
import { viewOptions } from '../../constants/index';
import { SearchAsset } from './SearchAsset';
import { Filters, FilterStructure } from './BrowseStep/Filters';
import { SortPicker } from './SortPicker';
import { Breadcrumbs } from './Breadcrumbs';
import { PageSize } from './BrowseStep/PageSize';
import { PaginationFooter } from './Pagination';
import { getBreadcrumbData } from '../../utils/getBreadcrumbData';
import { TableList, FileRow, FolderRow } from './TableList/TableList';
import { EmptyAssets } from './EmptyAssets';
import { usePersistentState } from '../../hooks/usePersistentState';
import { localStorageKeys } from '../../constants';

const TypographyMaxWidth = styled(Typography)`
  max-width: 100%;
`;

const ActionContainer = styled(Box)`
  svg {
    path {
      fill: ${({ theme }) => theme.colors.neutral500};
    }
  }
`;

interface PaginationData {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface FileWithType extends File {
  folderURL?: string;
  isSelectable?: boolean;
  type?: string;
}

export interface FolderWithType extends Folder {
  folderURL?: string;
  isSelectable?: boolean;
  type?: string;
}

interface BrowseStepProps {
  assets: File[];
  folders: Folder[];
  currentFolder?: Folder | null;
  onSelectAsset: (asset: File) => void;
  selectedAssets: File[];
  multiple?: boolean;
  onSelectAll?: () => void;
  queryObject: Query;
  onChangeQuery: (query: Query) => void;
  allowedTypes?: any;
  onChangeFolder?: (folderId: number | null, folderPath?: string) => void;
  onEditAsset?: (asset: File) => void;
  onEditFolder?: (folder: Folder) => void;
  pagination?: PaginationData;
  canCreate?: boolean;
  onAddAsset?: () => void;
}

export const BrowseStep = ({
  assets,
  folders,
  currentFolder,
  onSelectAsset,
  selectedAssets,
  multiple = false,
  onSelectAll,
  queryObject,
  onChangeQuery,
  allowedTypes,
  onChangeFolder,
  onEditAsset,
  onEditFolder,
  pagination,
  canCreate = false,
  onAddAsset,
}: BrowseStepProps) => {
  const { formatMessage } = useIntl();
  const [view, setView] = usePersistentState(localStorageKeys.modalView, viewOptions.GRID);
  const isGridView = view === viewOptions.GRID;

  const assetCount = assets.length;
  const folderCount = folders.length;
  const breadcrumbs = getBreadcrumbData(currentFolder || null);

  const isSearching = !!queryObject?._q;
  const isFiltering = !!queryObject?.filters?.$and?.length && queryObject.filters.$and.length > 0;
  const isSearchingOrFiltering = isSearching || isFiltering;

  const handleFolderClick = (folder: Folder) => {
    if (onChangeFolder) {
      // Clear search when navigating folders
      onChangeQuery({ ...queryObject, _q: undefined });
      onChangeFolder(folder.id, folder.path);
    }
  };

  const handleClickFolderCard = (folderId: number, folderPath?: string) => {
    if (onChangeFolder) {
      // Clear search when navigating folders
      onChangeQuery({ ...queryObject, _q: undefined });
      onChangeFolder(folderId, folderPath);
    }
  };

  const handleChangeSearch = (value: string | null) => {
    onChangeQuery({ ...queryObject, _q: value || undefined, page: 1 });
  };

  const handleChangeSort = (value: string) => {
    onChangeQuery({ ...queryObject, sort: value });
  };

  const handleChangeFilters = (filters: any) => {
    onChangeQuery({ ...queryObject, filters });
  };

  const handleChangePage = (page: number) => {
    onChangeQuery({ ...queryObject, page });
  };

  const handleChangePageSize = (pageSize: number) => {
    onChangeQuery({ ...queryObject, pageSize, page: 1 });
  };

  // Prepare data for table
  const rows: (FileRow | FolderRow)[] = [
    ...folders.map((folder) => ({ 
      ...folder, 
      type: 'folder' as const,
      isSelectable: false,
      folderURL: folder.path,
      children: folder.children || { count: 0 },
      files: folder.files || { count: 0 },
    } as FolderRow)),
    ...assets.map((asset) => ({ 
      ...asset, 
      type: 'asset' as const, 
      isSelectable: true,
      folderURL: asset.folderPath,
    } as FileRow)),
  ];

  const allAllowedAsset = assets; // In real implementation, this would filter by allowedTypes
  const areAllAssetSelected =
    allAllowedAsset.length > 0 &&
    selectedAssets.length > 0 &&
    allAllowedAsset.every(
      (asset) => selectedAssets.findIndex((currAsset) => currAsset.id === asset.id) !== -1
    );
  const hasSomeAssetSelected = allAllowedAsset.some(
    (asset) => selectedAssets.findIndex((currAsset) => currAsset.id === asset.id) !== -1
  );

  return (
    <Box>
      {onSelectAll && (
        <Box paddingBottom={4}>
          <Flex justifyContent="space-between" alignItems="flex-start">
            {(assetCount > 0 || folderCount > 0 || isFiltering) && (
              <Flex gap={2} wrap="wrap">
                {multiple && isGridView && (
                  <Flex
                    paddingLeft={2}
                    paddingRight={2}
                    background="neutral0"
                    hasRadius
                    borderColor="neutral200"
                    height="3.2rem"
                  >
                    <Checkbox
                      aria-label={formatMessage({
                        id: getTrad('bulk.select.label'),
                        defaultMessage: 'Select all assets',
                      })}
                      checked={
                        !areAllAssetSelected && hasSomeAssetSelected
                          ? 'indeterminate'
                          : areAllAssetSelected
                      }
                      onCheckedChange={onSelectAll}
                    />
                  </Flex>
                )}
                {isGridView && <SortPicker onChangeSort={(value: string | number) => handleChangeSort(String(value))} value={queryObject?.sort} />}
                <Filters
                  appliedFilters={queryObject?.filters?.$and as FilterStructure[]}
                  onChangeFilters={handleChangeFilters}
                />
              </Flex>
            )}

            {(assetCount > 0 || folderCount > 0 || isSearching) && (
              <Flex marginLeft="auto" shrink={0} gap={2}>
                <ActionContainer paddingTop={1} paddingBottom={1}>
                  <IconButton
                    label={
                      isGridView
                        ? formatMessage({
                            id: 'view-switch.list',
                            defaultMessage: 'List View',
                          })
                        : formatMessage({
                            id: 'view-switch.grid',
                            defaultMessage: 'Grid View',
                          })
                    }
                    onClick={() => setView(isGridView ? viewOptions.LIST : viewOptions.GRID)}
                  >
                    {isGridView ? <List /> : <GridIcon />}
                  </IconButton>
                </ActionContainer>
                <SearchAsset onChangeSearch={handleChangeSearch} queryValue={queryObject._q || ''} />
              </Flex>
            )}
          </Flex>
        </Box>
      )}

      {breadcrumbs && breadcrumbs.length > 0 && currentFolder && (
        <Box paddingTop={3}>
          <Breadcrumbs
            onChangeFolder={onChangeFolder}
            label={formatMessage({
              id: getTrad('header.breadcrumbs.nav.label'),
              defaultMessage: 'Folders navigation',
            })}
            breadcrumbs={breadcrumbs}
            currentFolderId={queryObject?.folder || null}
          />
        </Box>
      )}

      {assetCount === 0 && folderCount === 0 && (
        <Box paddingBottom={6}>
          <EmptyAssets
            size="S"
            count={6}
            action={
              canCreate &&
              !isFiltering &&
              !isSearching &&
              onAddAsset && (
                <Button variant="secondary" startIcon={<Plus />} onClick={onAddAsset}>
                  {formatMessage({
                    id: getTrad('header.actions.add-assets'),
                    defaultMessage: 'Add new assets',
                  })}
                </Button>
              )
            }
            content={
              isSearchingOrFiltering
                ? formatMessage({
                    id: getTrad('list.assets-empty.title-withSearch'),
                    defaultMessage: 'There are no assets with the applied filters',
                  })
                : canCreate && !isSearching
                  ? formatMessage({
                      id: getTrad('list.assets.empty'),
                      defaultMessage: 'Upload your first assets...',
                    })
                  : formatMessage({
                      id: getTrad('list.assets.empty.no-permissions'),
                      defaultMessage: 'The asset list is empty',
                    })
            }
          />
        </Box>
      )}

      {!isGridView && (folderCount > 0 || assetCount > 0) && (
        <TableList
          allowedTypes={allowedTypes}
          assetCount={assetCount}
          folderCount={folderCount}
          indeterminate={!areAllAssetSelected && hasSomeAssetSelected}
          isFolderSelectionAllowed={false}
          onChangeSort={handleChangeSort}
          onChangeFolder={(folderId) => {
            const folder = folders.find(f => f.id === folderId);
            if (folder) {
              handleFolderClick(folder);
            }
          }}
          onEditAsset={onEditAsset || null}
          onEditFolder={onEditFolder || null}
          onSelectOne={(row) => {
            if (row.type === 'asset') {
              onSelectAsset(row as File);
            }
          }}
          onSelectAll={(checked) => {
            if (onSelectAll) {
              onSelectAll();
            }
          }}
          rows={rows as any}
          selected={selectedAssets.map((asset) => ({ 
            ...asset, 
            type: 'asset' as const,
            isSelectable: true,
            folderURL: asset.folderPath,
          } as FileRow))}
          shouldDisableBulkSelect={!multiple}
          sortQuery={queryObject?.sort || ''}
        />
      )}

      {isGridView && (
        <>
          {folderCount > 0 && (
            <FolderGridList
              title={
                (((isSearchingOrFiltering && assetCount > 0) || !isSearchingOrFiltering) &&
                  formatMessage(
                    {
                      id: getTrad('list.folders.title'),
                      defaultMessage: 'Folders ({count})',
                    },
                    { count: folderCount }
                  )) ||
                ''
              }
            >
              {folders.map((folder) => {
                return (
                  <Grid.Item
                    col={3}
                    key={`folder-${folder.id}`}
                    direction="column"
                    alignItems="stretch"
                  >
                    <FolderCard
                      ariaLabel={folder.name}
                      id={`folder-${folder.id}`}
                      onClick={() => handleClickFolderCard(folder.id, folder.path)}
                      cardActions={
                        onEditFolder && (
                          <IconButton
                            withTooltip={false}
                            label={formatMessage({
                              id: getTrad('list.folder.edit'),
                              defaultMessage: 'Edit folder',
                            })}
                            onClick={() => onEditFolder({
                              ...folder,
                              type: 'folder' as const,
                              isSelectable: false,
                              folderURL: folder.path,
                              children: folder.children || { count: 0 },
                              files: folder.files || { count: 0 },
                            } as FolderRow)}
                          >
                            <Pencil />
                          </IconButton>
                        )
                      }
                    >
                      <FolderCardBody>
                        <FolderCardBodyAction
                          onClick={() => handleClickFolderCard(folder.id, folder.path)}
                        >
                          <Flex tag="h2" direction="column" alignItems="start" maxWidth="100%">
                            <TypographyMaxWidth
                              fontWeight="semiBold"
                              ellipsis
                              textColor="neutral800"
                            >
                              {folder.name}
                              <VisuallyHidden>-</VisuallyHidden>
                            </TypographyMaxWidth>
                            <TypographyMaxWidth
                              tag="span"
                              textColor="neutral600"
                              variant="pi"
                              ellipsis
                            >
                              {formatMessage(
                                {
                                  id: getTrad('list.folder.subtitle'),
                                  defaultMessage:
                                    '{folderCount, plural, =0 {# folder} one {# folder} other {# folders}}, {filesCount, plural, =0 {# asset} one {# asset} other {# assets}}',
                                },
                                {
                                  folderCount: folder.children?.count,
                                  filesCount: folder.files?.count,
                                }
                              )}
                            </TypographyMaxWidth>
                          </Flex>
                        </FolderCardBodyAction>
                      </FolderCardBody>
                    </FolderCard>
                  </Grid.Item>
                );
              })}
            </FolderGridList>
          )}

          {assetCount > 0 && folderCount > 0 && (
            <Box paddingTop={6}>
              <Divider />
            </Box>
          )}

          {assetCount > 0 && (
            <Box paddingTop={6}>
              <AssetGridList
                allowedTypes={allowedTypes}
                size="S"
                assets={assets}
                onSelectAsset={onSelectAsset}
                selectedAssets={selectedAssets}
                onEditAsset={onEditAsset}
                title={
                  ((!isSearchingOrFiltering || (isSearchingOrFiltering && folderCount > 0)) &&
                    queryObject.page === 1 &&
                    formatMessage(
                      {
                        id: getTrad('list.assets.title'),
                        defaultMessage: 'Assets ({count})',
                      },
                      { count: assetCount }
                    )) ||
                  ''
                }
              />
            </Box>
          )}
        </>
      )}

      {pagination && pagination.pageCount > 0 && (
        <Flex justifyContent="space-between" paddingTop={4} position="relative" zIndex={1}>
          <PageSize
            pageSize={queryObject.pageSize || 10}
            onChangePageSize={handleChangePageSize}
          />
          <PaginationFooter
            activePage={queryObject.page || 1}
            onChangePage={handleChangePage}
            pagination={pagination}
          />
        </Flex>
      )}
    </Box>
  );
};