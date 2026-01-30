/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#4630EB';
const tintColorDark = '#6366f1';

export const Colors = {
  light: {
    text: '#1f2937',
    textSecondary: '#6b7280',
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    tint: tintColorLight,
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorLight,
    cardBackground: '#ffffff',
    cardBorder: '#e5e7eb',
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    buttonPrimary: '#4630EB',
    buttonSecondary: '#f3f4f6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  dark: {
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    background: '#111827',
    backgroundSecondary: '#1f2937',
    tint: tintColorDark,
    icon: '#d1d5db',
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorDark,
    cardBackground: '#1f2937',
    cardBorder: '#374151',
    inputBackground: '#1f2937',
    inputBorder: '#4b5563',
    buttonPrimary: '#6366f1',
    buttonSecondary: '#374151',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
  },
};
