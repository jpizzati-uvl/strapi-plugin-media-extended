import * as React from 'react';
import { Modal, Tabs, Badge, Button, Flex, Loader, Divider, Typography, Box } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import type { File } from '../../utils/getAllowedFiles';
import { useAssets } from '../../hooks/useAssets';
import { useFolders } from '../../hooks/useFolders';
import { useFolder } from '../../hooks/useFolder';
import { useMediaLibraryPermissions } from '../../hooks/useMediaLibraryPermissions';
import { useSelectionState } from '../../hooks/useSelectionState';
import { getTrad } from '../../utils/getTrad';
import { getAllowedFiles } from '../../utils/getAllowedFiles';
import { moveElement } from '../../utils/moveElement';
import { containsAssetFilter } from '../../utils/containsAssetFilter';
import { BrowseStep } from './BrowseStep';
import { SelectedStep } from './SelectedStep';
import { EditAssetDialog } from './EditAssetDialog';
import { DialogFooter } from './DialogFooter';
import { Query } from '../../services/api';

type AllowedTypes = 'files' | 'images' | 'videos' | 'audios';

interface AssetDialogProps {
  allowedTypes?: AllowedTypes[] | null;
  folderId?: number | null;
  onClose: () => void;
  open: boolean;
  onValidate: (selectedAssets: File[]) => void;
  multiple?: boolean;
  onAddAsset: (arg?: { folderId: number | { id: number } | null | undefined }) => void;
  onAddFolder: (arg: { folderId: number | { id: number } | null | undefined }) => void;
  onChangeFolder: (folderId: number | null) => void;
  initiallySelectedAssets?: File[];
}

const TabsRoot = styled(Tabs.Root)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LoadingBody = styled(Flex)`
  /* 80px are coming from the Tabs component that is not included in the ModalBody */
  min-height: ${() => `calc(60vh + 8rem)`};
`;

export const AssetDialog = ({
  allowedTypes = null,
  folderId = null,
  onClose,
  open,
  onValidate,
  multiple = false,
  onAddAsset,
  onAddFolder,
  onChangeFolder,
  initiallySelectedAssets = [],
}: AssetDialogProps) => {
  const { formatMessage } = useIntl();
  const [queryObject, setQueryObject] = React.useState<Query>({
    page: 1,
    pageSize: 20,
    sort: 'name:asc',
    folder: folderId,
    folderPath: folderId ? undefined : '/',
  });
  const [activeTab, setActiveTab] = React.useState(
    initiallySelectedAssets.length > 0 ? 'selected' : 'browse'
  );
  const [assetToEdit, setAssetToEdit] = React.useState<File | null>(null);

  const {
    canRead,
    canCreate,
    isLoading: isLoadingPermissions,
  } = useMediaLibraryPermissions();

  const {
    data: assetsData,
    isLoading: isLoadingAssets,
    error: errorAssets,
  } = useAssets({ skipWhen: !canRead, query: queryObject });

  const {
    data: folders,
    isLoading: isLoadingFolders,
    error: errorFolders,
  } = useFolders({
    enabled: canRead && !containsAssetFilter(queryObject) && queryObject.page === 1,
    query: queryObject,
  });

  const {
    data: currentFolder,
    isLoading: isLoadingCurrentFolder,
  } = useFolder({
    id: queryObject.folder || null,
    enabled: canRead && !!queryObject.folder,
  });

  const [
    selectedAssets,
    { selectOne, selectOnly, setSelections, selectMultiple, deselectMultiple },
  ] = useSelectionState(['id'], initiallySelectedAssets);

  const handleSelectAsset = (asset: File) => {
    return multiple ? selectOne(asset) : selectOnly(asset);
  };

  const handleSelectAllAssets = () => {
    if (!multiple || !assetsData?.results) return;

    const allowedAssets = getAllowedFiles(allowedTypes, assetsData.results as any);
    const alreadySelected = allowedAssets.filter(
      (asset) => selectedAssets.findIndex((selectedAsset) => selectedAsset.id === asset.id) !== -1
    );

    if (alreadySelected.length > 0) {
      deselectMultiple(alreadySelected);
    } else {
      selectMultiple(allowedAssets);
    }
  };

  const handleMoveItem = (hoverIndex: number, destIndex: number) => {
    const offset = destIndex - hoverIndex;
    const orderedAssetsClone = selectedAssets.slice();
    const nextAssets = moveElement(orderedAssetsClone, hoverIndex, offset);
    setSelections(nextAssets);
  };

  const handleFolderChange = (folderId: number | null, folderPath?: string) => {
    onChangeFolder(folderId);
    setQueryObject(prev => ({ 
      ...prev, 
      folder: folderId, 
      folderPath: folderPath || (folderId ? undefined : '/'),
      page: 1, 
      _q: undefined 
    }));
  };

  const isLoading = isLoadingPermissions || isLoadingAssets || isLoadingFolders || isLoadingCurrentFolder;
  const hasError = errorAssets || errorFolders;

  if (!open) return null;

  return (
    <Modal.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            {formatMessage({
              id: getTrad('header.actions.add-assets'),
              defaultMessage: 'Add new assets',
            })}
          </Modal.Title>
        </Modal.Header>

        {isLoading ? (
          <>
            <LoadingBody justifyContent="center" paddingTop={4} paddingBottom={4}>
              <Loader>
                {formatMessage({
                  id: getTrad('content.isLoading'),
                  defaultMessage: 'Content is loading.',
                })}
              </Loader>
            </LoadingBody>
            <DialogFooter onClose={onClose} />
          </>
        ) : hasError ? (
          <>
            <Modal.Body>
              <Flex justifyContent="center" alignItems="center" height="60vh">
                <Typography textColor="danger600">
                  {formatMessage({ id: 'notification.error', defaultMessage: 'An error occurred' })}
                </Typography>
              </Flex>
            </Modal.Body>
            <DialogFooter onClose={onClose} />
          </>
        ) : (
          <TabsRoot variant="simple" value={activeTab} onValueChange={setActiveTab}>
            <Flex paddingLeft={8} paddingRight={8} paddingTop={6} justifyContent="space-between">
              <Tabs.List>
                <Tabs.Trigger value="browse">
                  {formatMessage({
                    id: getTrad('modal.nav.browse'),
                    defaultMessage: 'Browse',
                  })}
                </Tabs.Trigger>
                <Tabs.Trigger value="selected">
                  {formatMessage({
                    id: getTrad('modal.header.select-files'),
                    defaultMessage: 'Selected files',
                  })}
                  <Badge marginLeft={2}>{selectedAssets.length}</Badge>
                </Tabs.Trigger>
              </Tabs.List>
              <Flex gap={2}>
                {canCreate && (
                  <>
                    <Button variant="secondary" onClick={() => onAddFolder({ folderId: typeof queryObject?.folder === 'number' ? queryObject.folder : null })}>
                      {formatMessage({
                        id: getTrad('modal.upload-list.sub-header.add-folder'),
                        defaultMessage: 'Add folder',
                      })}
                    </Button>
                    <Button onClick={() => onAddAsset({ folderId: typeof queryObject?.folder === 'number' ? queryObject.folder : null })}>
                      {formatMessage({
                        id: getTrad('modal.upload-list.sub-header.button'),
                        defaultMessage: 'Add more assets',
                      })}
                    </Button>
                  </>
                )}
              </Flex>
            </Flex>
            <Divider />
            <Modal.Body>
              <Tabs.Content value="browse">
                <BrowseStep
                  assets={assetsData?.results || []}
                  folders={folders || []}
                  currentFolder={currentFolder}
                  onSelectAsset={handleSelectAsset}
                  selectedAssets={selectedAssets}
                  multiple={multiple}
                  onSelectAll={handleSelectAllAssets}
                  queryObject={queryObject}
                  onChangeQuery={setQueryObject}
                  allowedTypes={allowedTypes}
                  onChangeFolder={handleFolderChange}
                  onEditAsset={setAssetToEdit}
                  pagination={assetsData?.pagination}
                />
              </Tabs.Content>
              <Tabs.Content value="selected">
                <SelectedStep
                  selectedAssets={selectedAssets}
                  onSelectAsset={handleSelectAsset}
                  onReorderAsset={handleMoveItem}
                />
              </Tabs.Content>
            </Modal.Body>
          </TabsRoot>
        )}
        <DialogFooter onClose={onClose} onValidate={() => {
          if (selectedAssets.length === 0) {
            onClose();
          } else {
            onValidate(selectedAssets);
          }
        }} />
      </Modal.Content>
      
      {/* Edit Asset Dialog */}
      {assetToEdit && (
        <EditAssetDialog
          asset={assetToEdit}
          open={!!assetToEdit}
          onClose={(editedAsset) => {
            setAssetToEdit(null);
            if (editedAsset === null) {
              // Asset was deleted - remove from selected assets
              setSelections(selectedAssets.filter(asset => asset.id !== assetToEdit.id));
            } else if (editedAsset && typeof editedAsset !== "boolean") {
              // Asset was updated - update in selected assets
              setSelections(selectedAssets.map(asset => 
                asset.id === editedAsset.id ? editedAsset : asset
              ));
            }
          }}
          canUpdate={canCreate}
          canCopyLink={true}
          canDownload={true}
        />
      )}
    </Modal.Root>
  );
};