export const prefixFileUrlWithBackendUrl = (url: string): string | undefined => {
  if (!url) {
    return undefined;
  }

  // If the URL is already absolute, return it as is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }

  // Otherwise, prefix with the backend URL
  const backendUrl = (window as any).strapi?.backendURL || '';
  return `${backendUrl}${url}`;
};