import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';

type FloatingPlusButtonProps = {
  onPress: () => void;
};

export function FloatingPlusButton({ onPress }: FloatingPlusButtonProps) {
  const { theme } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        right: 24,
        bottom: 24,
        backgroundColor: theme === "dark" ? "#4630EB" : "#4630EB",
        borderRadius: 32,
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 10
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={32} color="white" />
    </TouchableOpacity>
  );
}
