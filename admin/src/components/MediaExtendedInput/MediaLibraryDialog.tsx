import * as React from 'react';
import { Modal, Tabs, Badge, Button, Flex, Loader, Box, Typography } from '@strapi/design-system';
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
import { UploadAssetDialog } from './UploadAssetDialog';
import { EditFolderDialog } from './EditFolderDialog';
import { Query, Folder } from '../../services/api';

type AllowedTypes = 'files' | 'images' | 'videos' | 'audios';

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectAssets: (assets: File[]) => void;
  multiple?: boolean;
  allowedTypes?: AllowedTypes[] | null;
  selectedAssets?: File[];
}

const TabsRoot = styled(Tabs.Root)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LoadingBody = styled(Flex)`
  min-height: 60vh;
`;

export const MediaLibraryDialog = ({
  open,
  onClose,
  onSelectAssets,
  multiple = false,
  allowedTypes = null,
  selectedAssets: initiallySelectedAssets = [],
}: MediaLibraryDialogProps) => {
  const { formatMessage } = useIntl();
  const [queryObject, setQueryObject] = React.useState<Query>({
    page: 1,
    pageSize: 20,
    sort: 'createdAt:desc',
  });
  const [showUploadDialog, setShowUploadDialog] = React.useState(false);
  const [editingFolder, setEditingFolder] = React.useState<Folder | null>(null);
  const [activeTab, setActiveTab] = React.useState(
    initiallySelectedAssets.length > 0 ? 'selected' : 'browse'
  );

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

  const { data: currentFolder } = useFolder({
    id: queryObject?.folder as number | null | undefined,
    enabled: canRead && !!queryObject?.folder,
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

  const handleChangeFolder = (folderId: number | null, folderPath?: string) => {
    setQueryObject((prev) => ({
      ...prev,
      folder: folderId,
      folderPath: folderPath || '/',
      page: 1,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onSelectAssets(selectedAssets);
    onClose();
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
  };

  const isLoading = isLoadingPermissions || isLoadingAssets || isLoadingFolders;
  const hasError = errorAssets || errorFolders;

  if (!open) return null;

  return (
    <>
      <Modal.Root open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
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
              <LoadingBody justifyContent="center" alignItems="center">
                <Loader>
                  {formatMessage({
                    id: getTrad('content.isLoading'),
                    defaultMessage: 'Content is loading.',
                  })}
                </Loader>
              </LoadingBody>
              <Modal.Footer>
                <Modal.Close>
                  <Modal.Trigger>
                    {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
                  </Modal.Trigger>
                </Modal.Close>
              </Modal.Footer>
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
              <Modal.Footer>
                <Modal.Close>
                  <Modal.Trigger>
                    {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
                  </Modal.Trigger>
                </Modal.Close>
              </Modal.Footer>
            </>
          ) : (
            <TabsRoot value={activeTab} onValueChange={setActiveTab}>
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
                {canCreate && (
                  <Button onClick={() => setShowUploadDialog(true)}>
                    {formatMessage({
                      id: getTrad('modal.upload-list.sub-header.button'),
                      defaultMessage: 'Add more assets',
                    })}
                  </Button>
                )}
              </Flex>
              <Box paddingTop={4}>
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
                    pagination={assetsData?.pagination}
                    onChangeFolder={handleChangeFolder}
                    onEditFolder={handleEditFolder}
                    canCreate={canCreate}
                    onAddAsset={() => setShowUploadDialog(true)}
                  />
                </Tabs.Content>
                <Tabs.Content value="selected">
                  <SelectedStep
                    selectedAssets={selectedAssets}
                    onSelectAsset={handleSelectAsset}
                    onReorderAsset={handleMoveItem}
                  />
                </Tabs.Content>
              </Box>
              <Modal.Footer>
                <Modal.Close>
                  <Modal.Trigger>
                    {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
                  </Modal.Trigger>
                </Modal.Close>
                <Button onClick={handleConfirm}>
                  {formatMessage({ id: 'confirm', defaultMessage: 'Confirm' })}
                </Button>
              </Modal.Footer>
            </TabsRoot>
          )}
        </Modal.Content>
      </Modal.Root>

      {showUploadDialog && (
        <UploadAssetDialog
          open={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
          addUploadedFiles={(uploadedAssets) => {
            selectMultiple(uploadedAssets as File[]);
            setShowUploadDialog(false);
          }}
        />
      )}

      {editingFolder && (
        <EditFolderDialog
          open={!!editingFolder}
          onClose={() => setEditingFolder(null)}
          folder={{
            id: editingFolder.id,
            name: editingFolder.name,
            parent: typeof editingFolder.parent === 'object' ? editingFolder.parent?.id : editingFolder.parent,
          }}
          parentFolderId={typeof editingFolder.parent === 'object' ? editingFolder.parent?.id : editingFolder.parent || null}
        />
      )}
    </>
  );
};