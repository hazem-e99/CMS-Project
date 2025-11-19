import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import ku from './locales/ku.json';

/**
 * i18n Configuration
 * Supports: English (LTR), Arabic (RTL), Kurdish-Sorani (RTL)
 */
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      ku: { translation: ku },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

// RTL languages
export const RTL_LANGUAGES = ['ar', 'ku'];

// Check if language is RTL
export const isRTL = (lang) => RTL_LANGUAGES.includes(lang);

// Update document direction based on language
export const updateDocumentDirection = (lang) => {
  const dir = isRTL(lang) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};

// Initialize direction on load
updateDocumentDirection(i18n.language);

// Listen to language changes
i18n.on('languageChanged', updateDocumentDirection);

export default i18n;

