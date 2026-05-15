import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tr from './locales/tr.json';
import en from './locales/en.json';

const DEFAULT_LANGUAGE = 'tr';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
