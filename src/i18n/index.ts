import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';

import tr from './locales/tr.json';
import en from './locales/en.json';

// Web opens in Turkish by default (primary market); native follows the device.
const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
const initialLanguage =
  Platform.OS === 'web' ? 'tr' : deviceLanguage === 'tr' ? 'tr' : 'en';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
