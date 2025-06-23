import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import {  useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { ThemeProvider, ThemeContext } from '@/theme/ThemeContext';
import { ThemedText } from '@/components/ThemedText';

export default function Layout() {
  const themeContextRef = useRef<{ theme: string; toggleTheme: () => void } | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemeContext.Consumer>
          {themeContext => {
            themeContextRef.current = themeContext;
            return (
              <Stack
                screenOptions={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: themeContext?.theme === "dark" ? "#18181b" : "#fff"
                  },
                  headerTitleStyle: {
                    color: themeContext?.theme === "dark" ? "#fff" : "#222"
                  },
                  headerLeft: ({ canGoBack }) =>
                    canGoBack ? (
                      <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                        <Feather name="arrow-left" size={24} color={themeContext?.theme === "dark" ? "#fff" : "black"} />
                      </Pressable>
                    ) : null
                }}
              >
                <Stack.Screen
                  name="index"
                  options={{
                    title: "MeTracker Home",
                    headerLeft: () => null,
                    headerRight: () => (
                      <Pressable
                        onPress={() => themeContext?.toggleTheme()}
                        style={{
                          marginRight: 12,
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: themeContext?.theme === "dark" ? "#27272a" : "#e5e7eb"
                        }}
                      >
                        <ThemedText style={{ color: themeContext?.theme === "dark" ? "#fff" : "#222" }}>
                          {themeContext?.theme === "dark" ? "☀️" : "🌙"}
                        </ThemedText>
                      </Pressable>
                    ),
                  }}
                />
                <Stack.Screen
                  name="caffeine"
                  options={{
                    title: "Caffeine Tracker"
                  }}
                />
                <Stack.Screen
                  name="toilet"
                  options={{
                    title: "Toilet Logs"
                  }}
                />
                <Stack.Screen
                  name="createTracker"
                  options={{
                    title: "Create Tracker"
                  }}
                />
                <Stack.Screen
                  name="customTrackers"
                  options={{
                    headerShown: false
                  }}
                />
              </Stack>
            );
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}