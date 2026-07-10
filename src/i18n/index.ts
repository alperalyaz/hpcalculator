import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';

import tr from './locales/tr.json';
import en from './locales/en.json';

// Language selection:
// - Web: driven by hostname — calculate.* opens in English, every other
//   host (hesapla.*, the Vercel URL) opens in Turkish (primary market).
// - Native: follows the device locale.
const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';

const resolveInitialLanguage = (): 'tr' | 'en' => {
  if (Platform.OS === 'web') {
    try {
      const host = window.location.hostname.toLowerCase();
      if (host.startsWith('calculate.')) return 'en';
    } catch {
      // window not available (SSR/build) — fall through to Turkish default
    }
    return 'tr';
  }
  return deviceLanguage === 'tr' ? 'tr' : 'en';
};

const initialLanguage = resolveInitialLanguage();

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
