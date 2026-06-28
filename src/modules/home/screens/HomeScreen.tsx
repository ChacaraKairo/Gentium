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

      <ListItem
        description={t('home.foundationDescription')}
        icon="leaf-outline"
        title={t('home.foundation')}
      />
    </Screen>
  );
}
