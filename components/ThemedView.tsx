import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { theme } = useContext(ThemeContext);
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
    theme
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
