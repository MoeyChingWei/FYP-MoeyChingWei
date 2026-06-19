import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nConfig } from './config';

// Import translation files
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enDashboard from './locales/en/dashboard.json';
import enSettings from './locales/en/settings.json';
import enPurchasing from './locales/en/purchasing.json';
import enSupplier from './locales/en/supplier.json';
import enUserAccess from './locales/en/userAccess.json';
import enChatbot from './locales/en/chatbot.json';
import enProfile from './locales/en/profile.json';
import enTracking from './locales/en/tracking.json';
import enMessages from './locales/en/messages.json';
import enValidation from './locales/en/validation.json';
import enAuth from './locales/en/auth.json';
import enNotifications from './locales/en/notifications.json';
import enLookupTable from './locales/en/lookupTable.json';
import enMultiAgent from './locales/en/multiAgent.json';
import enUserGuide from './locales/en/userGuide.json';

import zhCommon from './locales/zh/common.json';
import zhNavigation from './locales/zh/navigation.json';
import zhDashboard from './locales/zh/dashboard.json';
import zhSettings from './locales/zh/settings.json';
import zhPurchasing from './locales/zh/purchasing.json';
import zhSupplier from './locales/zh/supplier.json';
import zhUserAccess from './locales/zh/userAccess.json';
import zhChatbot from './locales/zh/chatbot.json';
import zhProfile from './locales/zh/profile.json';
import zhTracking from './locales/zh/tracking.json';
import zhMessages from './locales/zh/messages.json';
import zhValidation from './locales/zh/validation.json';
import zhAuth from './locales/zh/auth.json';
import zhNotifications from './locales/zh/notifications.json';
import zhLookupTable from './locales/zh/lookupTable.json';
import zhMultiAgent from './locales/zh/multiAgent.json';
import zhUserGuide from './locales/zh/userGuide.json';

import msCommon from './locales/ms/common.json';
import msNavigation from './locales/ms/navigation.json';
import msDashboard from './locales/ms/dashboard.json';
import msSettings from './locales/ms/settings.json';
import msPurchasing from './locales/ms/purchasing.json';
import msSupplier from './locales/ms/supplier.json';
import msUserAccess from './locales/ms/userAccess.json';
import msChatbot from './locales/ms/chatbot.json';
import msProfile from './locales/ms/profile.json';
import msTracking from './locales/ms/tracking.json';
import msMessages from './locales/ms/messages.json';
import msValidation from './locales/ms/validation.json';
import msAuth from './locales/ms/auth.json';
import msNotifications from './locales/ms/notifications.json';
import msLookupTable from './locales/ms/lookupTable.json';
import msMultiAgent from './locales/ms/multiAgent.json';
import msUserGuide from './locales/ms/userGuide.json';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    settings: enSettings,
    purchasing: enPurchasing,
    supplier: enSupplier,
    userAccess: enUserAccess,
    chatbot: enChatbot,
    profile: enProfile,
    tracking: enTracking,
    messages: enMessages,
    validation: enValidation,
    auth: enAuth,
    notifications: enNotifications,
    lookupTable: enLookupTable,
    multiAgent: enMultiAgent,
    userGuide: enUserGuide,
  },
  zh: {
    common: zhCommon,
    navigation: zhNavigation,
    dashboard: zhDashboard,
    settings: zhSettings,
    purchasing: zhPurchasing,
    supplier: zhSupplier,
    userAccess: zhUserAccess,
    chatbot: zhChatbot,
    profile: zhProfile,
    tracking: zhTracking,
    messages: zhMessages,
    validation: zhValidation,
    auth: zhAuth,
    notifications: zhNotifications,
    lookupTable: zhLookupTable,
    multiAgent: zhMultiAgent,
    userGuide: zhUserGuide,
  },
  ms: {
    common: msCommon,
    navigation: msNavigation,
    dashboard: msDashboard,
    settings: msSettings,
    purchasing: msPurchasing,
    supplier: msSupplier,
    userAccess: msUserAccess,
    chatbot: msChatbot,
    profile: msProfile,
    tracking: msTracking,
    messages: msMessages,
    validation: msValidation,
    auth: msAuth,
    notifications: msNotifications,
    lookupTable: msLookupTable,
    multiAgent: msMultiAgent,
    userGuide: msUserGuide,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    resources,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
