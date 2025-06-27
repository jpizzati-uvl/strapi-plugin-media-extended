export interface TranslationMessages {
  [key: string]: string;
}

export const prefixPluginTranslations = (
  trad: TranslationMessages,
  pluginId: string
): TranslationMessages => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {} as TranslationMessages);
};