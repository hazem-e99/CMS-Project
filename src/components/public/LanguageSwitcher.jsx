import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Language Switcher Component
 * Allows switching between EN, AR, KU
 */
export const LanguageSwitcher = ({ compact = false }) => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN', fullLabel: t('languages.en') },
    { code: 'ar', label: 'AR', fullLabel: t('languages.ar') },
    { code: 'ku', label: 'KU', fullLabel: t('languages.ku') },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  if (compact) {
    return (
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            i18n.language === lang.code
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          title={lang.fullLabel}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

