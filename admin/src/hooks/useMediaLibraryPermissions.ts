// Simplified permissions hook for plugin context
export const useMediaLibraryPermissions = () => {
  // In a plugin context, we'll assume all permissions are granted
  // since the user already has access to the field
  return {
    isLoading: false,
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDownload: true,
    canCopyLink: true,
  };
};