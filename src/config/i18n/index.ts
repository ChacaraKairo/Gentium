import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enUS from './locales/en-US/common.json';
import ptBR from './locales/pt-BR/common.json';

export const fallbackLanguage = 'pt-BR';
export const supportedLanguages = ['pt-BR', 'en-US'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
  lng: fallbackLanguage,
  resources: {
    'en-US': {
      common: enUS,
    },
    'pt-BR': {
      common: ptBR,
    },
  },
  defaultNS: 'common',
});

export default i18n;
