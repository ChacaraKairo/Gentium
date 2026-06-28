import { TextInput as NativeTextInput, TextInputProps as NativeTextInputProps } from 'react-native';

import { useThemeTokens } from '@/theme/useThemeTokens';

type TextInputProps = NativeTextInputProps & {
  hasError?: boolean;
};

export function TextInput({ hasError = false, style, ...props }: TextInputProps) {
  const theme = useThemeTokens();

  return (
    <NativeTextInput
      placeholderTextColor={theme.colors.textSecondary}
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderColor: hasError ? theme.colors.danger : theme.colors.border,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          color: theme.colors.text,
          fontSize: theme.typography.body.fontSize,
          minHeight: 48,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
        style,
      ]}
    />
  );
}
