import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { BaseCard, Button, ListItem, AppText } from '@/shared/components';
import { MainTabParamList } from '@/navigation/types';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

const marsala = '#7A1F2B';
const marsalaDark = '#571521';
const marsalaSoft = '#F8E7EA';

export function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const theme = useThemeTokens();

  return (
    <Screen subtitle={t('home.subtitle')} title={t('home.title')}>
      <BaseCard
        style={{
          backgroundColor: marsala,
          borderColor: marsalaDark,
          gap: theme.spacing.md,
          padding: theme.spacing.lg,
        }}
      >
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: theme.spacing.md }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: marsalaSoft,
              borderRadius: theme.radius.pill,
              flexDirection: 'row',
              height: 56,
              justifyContent: 'center',
              width: 56,
            }}
          >
            <Ionicons color={marsala} name="hand-left-outline" size={24} />
            <Ionicons color={marsala} name="hand-right-outline" size={24} style={{ marginLeft: -8 }} />
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <AppText style={{ color: theme.colors.surface }} variant="heading">
              {t('home.donationsTitle')}
            </AppText>
            <AppText style={{ color: marsalaSoft }}>{t('home.donationsDescription')}</AppText>
          </View>
        </View>
        <Pressable
          accessibilityLabel={t('home.donationsAction')}
          accessibilityRole="button"
          onPress={() => navigation.navigate('Donations')}
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            minHeight: 48,
            justifyContent: 'center',
            opacity: pressed ? 0.82 : 1,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          })}
        >
          <AppText style={{ color: marsala }}>{t('home.donationsAction')}</AppText>
        </Pressable>
      </BaseCard>

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

      <ListItem
        description={t('home.foundationDescription')}
        icon="leaf-outline"
        title={t('home.foundation')}
      />
    </Screen>
  );
}
