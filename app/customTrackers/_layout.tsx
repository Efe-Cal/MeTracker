import { Stack } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';
import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Layout() {
  const { theme } = useContext(ThemeContext);
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === "dark" ? "#18181b" : "#fff"
        },
        headerTitleStyle: {
          color: theme === "dark" ? "#fff" : "#222"
        },
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
              <Feather name="arrow-left" size={24} color={theme === "dark" ? "#fff" : "black"} />
            </Pressable>
          ) : null
      }}
    >
      <Stack.Screen name="[name]" options={
        ({ route }) => ({
          title: decodeURIComponent(route.params?.name) || "Custom Tracker",
          headerTitleAlign: "left",
        })
      }/>
      <Stack.Screen name="add" />
    </Stack>
  );
}
