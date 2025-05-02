// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';

// const resources = {
//   en: { translation: en },
//   hi: { translation: hi },
//   gu: { translation: gu },
// };

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     fallbackLng: 'en',
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;



import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
    },
    lng: localStorage.getItem("appLanguage") || undefined, // Only use explicit selection
    fallbackLng: false, // Don't fallback automatically
    detection: {
      // Disable detection
      order: [],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;