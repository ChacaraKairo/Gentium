import { ActivityIndicator, Pressable, PressableProps } from 'react-native';

import { AppText } from './AppText';
import { useThemeTokens } from '@/theme/useThemeTokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = PressableProps & {
  isLoading?: boolean;
  label: string;
  variant?: ButtonVariant;
};

export function Button({
  disabled,
  isLoading = false,
  label,
  style,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const theme = useThemeTokens();
  const isDisabled = disabled || isLoading;

  const backgroundColor =
    variant === 'primary' ? theme.colors.primary : variant === 'secondary' ? theme.colors.muted : 'transparent';
  const textColor = variant === 'primary' ? theme.colors.surface : theme.colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      {...props}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          backgroundColor,
          borderColor: variant === 'ghost' ? 'transparent' : theme.colors.border,
          borderRadius: theme.radius.md,
          borderWidth: variant === 'primary' ? 0 : 1,
          minHeight: 48,
          justifyContent: 'center',
          opacity: isDisabled ? 0.56 : pressed ? 0.82 : 1,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText style={{ color: textColor }} variant="body">
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
