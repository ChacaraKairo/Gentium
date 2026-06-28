import { PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';

import { useThemeTokens } from '@/theme/useThemeTokens';

export function BaseCard({ children, style, ...props }: PropsWithChildren<ViewProps>) {
  const theme = useThemeTokens();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          padding: theme.spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
