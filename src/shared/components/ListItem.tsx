import { Ionicons } from '@expo/vector-icons';
import { Pressable, PressableProps, View } from 'react-native';

import { AppText } from './AppText';
import { useThemeTokens } from '@/theme/useThemeTokens';

type ListItemProps = PressableProps & {
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
};

export function ListItem({ description, icon, style, title, ...props }: ListItemProps) {
  const theme = useThemeTokens();

  return (
    <Pressable
      accessibilityLabel={description ? `${title}. ${description}` : title}
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          flexDirection: 'row',
          gap: theme.spacing.md,
          minHeight: 64,
          opacity: pressed ? 0.72 : 1,
          padding: theme.spacing.md,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      {icon ? <Ionicons color={theme.colors.primary} name={icon} size={22} /> : null}
      <View style={{ flex: 1 }}>
        <AppText>{title}</AppText>
        {description ? (
          <AppText color="textSecondary" variant="caption">
            {description}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}
