import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import {  useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { ThemeProvider, ThemeContext } from '@/theme/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import Toast from 'react-native-toast-message';

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
                        onPress={() => router.push("/settings")}
                        style={{
                          marginRight: 12,
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: themeContext?.theme === "dark" ? "#27272a" : "#e5e7eb",
                          flexDirection: "row",
                          alignItems: "center",
                          width: 40,
                          height: 40,
                          justifyContent: "center",
                        }}
                      >
                        <Feather
                          name="settings"
                          size={22}
                          color={themeContext?.theme === "dark" ? "#fff" : "#222"}
                        />
                      </Pressable>
                    ),
                  }}
                />
                <Stack.Screen
                  name="caffeine"
                  options={{
                    title: "Caffeine Tracker",
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
                <Stack.Screen
                  name="settings"
                  options={{
                    title: "Settings",
                  }}
                />
              </Stack>
            );
          }}
        </ThemeContext.Consumer>
        <Toast/>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}