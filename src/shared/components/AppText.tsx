import { PropsWithChildren } from 'react';
import { Text, TextProps } from 'react-native';

import { useThemeTokens } from '@/theme/useThemeTokens';

type AppTextVariant = 'title' | 'heading' | 'body' | 'caption';

type AppTextProps = PropsWithChildren<
  TextProps & {
    color?: 'text' | 'textSecondary' | 'primary' | 'danger';
    variant?: AppTextVariant;
  }
>;

export function AppText({
  children,
  color = 'text',
  style,
  variant = 'body',
  ...props
}: AppTextProps) {
  const theme = useThemeTokens();

  return (
    <Text
      {...props}
      style={[
        theme.typography[variant],
        {
          color: theme.colors[color],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
