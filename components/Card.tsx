import { StyleProp, ViewStyle } from 'react-native';
import { ThemedView } from './ThemedView';
import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  const { theme } = useContext(ThemeContext);
  return (
    <ThemedView
      style={[
        {
          backgroundColor: theme === 'dark' ? '#27272a' : 'white',
          borderRadius: 10,
          padding: 10,
          shadowColor: theme === 'dark' ? '#000' : 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 5,
          display: "flex"
        },
        style
      ]}
    >
      {children}
    </ThemedView>
  );
}