import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enUS from './locales/en-US/common.json';
import ptBR from './locales/pt-BR/common.json';

const fallbackLanguage = 'pt-BR';
const supportedLanguages = ['pt-BR', 'en-US'] as const;

function resolveLanguage() {
  const deviceLanguage = Localization.getLocales()[0]?.languageTag;

  if (deviceLanguage && supportedLanguages.includes(deviceLanguage as (typeof supportedLanguages)[number])) {
    return deviceLanguage;
  }

  return fallbackLanguage;
}

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
  lng: resolveLanguage(),
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
