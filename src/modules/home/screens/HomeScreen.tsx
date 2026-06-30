import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { BaseCard, Button, ListItem, AppText } from '@/shared/components';
import { MainTabParamList } from '@/navigation/types';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const theme = useThemeTokens();

  return (
    <Screen subtitle={t('home.subtitle')} title={t('home.title')}>
      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('home.continueReading')}</AppText>
        <AppText color="textSecondary">{t('home.continueDescriptionV02')}</AppText>
        <Button label={t('home.continueReading')} onPress={() => navigation.navigate('Bible')} />
      </BaseCard>

      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('home.bibleExperienceTitle')}</AppText>
        <AppText color="textSecondary">{t('home.bibleExperienceDescription')}</AppText>
        <Button
          label={t('home.bibleVersionsAction')}
          onPress={() => navigation.navigate('Bible', { initialReadingMode: 'translation' })}
          variant="secondary"
        />
        <Button
          label={t('home.originalScripturesAction')}
          onPress={() => navigation.navigate('Bible', { initialReadingMode: 'original' })}
          variant="secondary"
        />
      </BaseCard>

      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('home.donationsTitle')}</AppText>
        <AppText color="textSecondary">{t('home.donationsDescription')}</AppText>
        <Button label={t('home.donationsAction')} onPress={() => navigation.navigate('Donations')} />
      </BaseCard>

      <ListItem
        description={t('home.foundationDescription')}
        icon="leaf-outline"
        title={t('home.foundation')}
      />
    </Screen>
  );
}
