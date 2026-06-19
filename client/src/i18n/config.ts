export const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh', 'ms'],
  defaultNS: 'common',
  ns: ['common', 'navigation', 'dashboard', 'settings', 'userGuide'],
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false, // Disable to avoid loading flicker
  },
};

export type SupportedLanguage = 'en' | 'zh' | 'ms';
