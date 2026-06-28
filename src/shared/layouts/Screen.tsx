import { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/shared/components';
import { useThemeTokens } from '@/theme/useThemeTokens';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  subtitle?: string;
  title: string;
}>;

export function Screen({ children, scroll = true, subtitle, title }: ScreenProps) {
  const theme = useThemeTokens();
  const Content = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Content
        contentContainerStyle={
          scroll
            ? {
                gap: theme.spacing.lg,
                padding: theme.spacing.lg,
              }
            : undefined
        }
        style={
          scroll
            ? undefined
            : {
                flex: 1,
                gap: theme.spacing.lg,
                padding: theme.spacing.lg,
              }
        }
      >
        <View style={{ gap: theme.spacing.sm }}>
          <AppText variant="title">{title}</AppText>
          {subtitle ? (
            <AppText color="textSecondary" variant="body">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {children}
      </Content>
    </SafeAreaView>
  );
}
