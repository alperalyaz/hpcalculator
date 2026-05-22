import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import tr from './locales/tr.json';
import en from './locales/en.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
const initialLanguage = deviceLanguage === 'tr' ? 'tr' : 'en';

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
