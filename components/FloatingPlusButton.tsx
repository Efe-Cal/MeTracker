import { TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';
import { Colors } from '@/constants/Colors';

type FloatingPlusButtonProps = {
  onPress: () => void;
};

export function FloatingPlusButton({ onPress }: FloatingPlusButtonProps) {
  const { theme } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary,
        borderRadius: 28,
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          },
          android: {
            elevation: 8,
          },
        }),
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={28} color="white" />
    </TouchableOpacity>
  );
}
