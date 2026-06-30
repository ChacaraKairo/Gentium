import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { AdvancedLibraryScreen } from '@/modules/advancedLibrary/screens/AdvancedLibraryScreen';
import { BibleScreen } from '@/modules/bible/screens/BibleScreen';
import { DonationsScreen } from '@/modules/donations/screens/DonationsScreen';
import { HomeScreen } from '@/modules/home/screens/HomeScreen';
import { NotesScreen } from '@/modules/notes/screens/NotesScreen';
import { ReadingPlansScreen } from '@/modules/readingPlans/screens/ReadingPlansScreen';
import { SettingsScreen } from '@/modules/settings/screens/SettingsScreen';
import { StudiesScreen } from '@/modules/studies/screens/StudiesScreen';
import { MainTabParamList } from '@/navigation/types';
import { useThemeTokens } from '@/theme/useThemeTokens';

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  AdvancedLibrary: 'file-tray-full-outline',
  Bible: 'book-outline',
  Donations: 'heart-circle-outline',
  Home: 'home-outline',
  More: 'menu-outline',
  Notes: 'create-outline',
  ReadingPlans: 'calendar-outline',
  Studies: 'library-outline',
};

export function RootNavigator() {
  const { t } = useTranslation();
  const theme = useThemeTokens();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: theme.typography.caption.fontSize,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          minHeight: 64,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.xs,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons color={color} name={icons[route.name]} size={size} />
        ),
      })}
    >
      <Tab.Screen component={HomeScreen} name="Home" options={{ title: t('tabs.home') }} />
      <Tab.Screen component={BibleScreen} name="Bible" options={{ title: t('tabs.bible') }} />
      <Tab.Screen
        component={DonationsScreen}
        name="Donations"
        options={{
          tabBarButton: () => null,
          title: t('tabs.donations'),
        }}
      />
      <Tab.Screen component={StudiesScreen} name="Studies" options={{ title: t('tabs.studies') }} />
      <Tab.Screen
        component={ReadingPlansScreen}
        name="ReadingPlans"
        options={{ title: t('tabs.readingPlans') }}
      />
      <Tab.Screen
        component={AdvancedLibraryScreen}
        name="AdvancedLibrary"
        options={{ title: t('tabs.advancedLibrary') }}
      />
      <Tab.Screen component={NotesScreen} name="Notes" options={{ title: t('tabs.notes') }} />
      <Tab.Screen component={SettingsScreen} name="More" options={{ title: t('tabs.more') }} />
    </Tab.Navigator>
  );
}
