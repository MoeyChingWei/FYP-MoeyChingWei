export const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh', 'ms'],
  defaultNS: 'common',
  ns: [
    'common', 'navigation', 'dashboard', 'settings', 'purchasing', 'supplier',
    'userAccess', 'chatbot', 'profile', 'tracking', 'messages', 'validation',
    'auth', 'notifications', 'lookupTable', 'multiAgent', 'userGuide',
    'budgetManagement', 'finance',
  ],
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false, // Disable to avoid loading flicker
  },
};

export type SupportedLanguage = 'en' | 'zh' | 'ms';
