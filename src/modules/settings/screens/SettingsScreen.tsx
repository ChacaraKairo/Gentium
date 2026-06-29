import { useTranslation } from 'react-i18next';

import { ListItem } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';

export function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <Screen subtitle={t('settings.subtitle')} title={t('settings.title')}>
      <ListItem
        description={t('settings.appearanceDescription')}
        icon="contrast-outline"
        title={t('settings.appearance')}
      />
      <ListItem
        description={t('settings.languageDescription')}
        icon="language-outline"
        title={t('settings.language')}
      />
      <ListItem
        description={t('settings.aboutDescription')}
        icon="information-circle-outline"
        title={t('settings.about')}
      />
      <ListItem
        description={t('settings.bibleLicenseDescription')}
        icon="document-text-outline"
        title={t('settings.bibleLicense')}
      />
    </Screen>
  );
}
