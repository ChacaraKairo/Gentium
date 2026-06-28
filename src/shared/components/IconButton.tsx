import { Ionicons } from '@expo/vector-icons';
import { Pressable, PressableProps } from 'react-native';

import { useThemeTokens } from '@/theme/useThemeTokens';

type IconButtonProps = PressableProps & {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export function IconButton({ icon, label, style, ...props }: IconButtonProps) {
  const theme = useThemeTokens();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={theme.spacing.sm}
      {...props}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.pill,
          borderWidth: 1,
          height: 44,
          justifyContent: 'center',
          opacity: pressed ? 0.72 : 1,
          width: 44,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      <Ionicons color={theme.colors.text} name={icon} size={22} />
    </Pressable>
  );
}
