import { Href, Stack } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';
import { Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';


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
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12, paddingRight:16 }}>
              <Feather name="arrow-left" size={24} color={theme === "dark" ? "#fff" : "black"} />
            </Pressable>
          ) : null
      }}
    >
      <Stack.Screen name="[name]" options={
        ({ route }) => ({
          title: decodeURIComponent(route.params?.name) || "Custom Tracker",
          headerTitleAlign: "left",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {router.push(("/customTrackers/settings/" + route.params?.name) as Href)}}
              style={{ paddingHorizontal: 12 }}
            >
              <Ionicons
                name="settings-sharp"
                size={24}
                color={theme === "dark" ? "#fff" : "black"}
              />
            </TouchableOpacity>
          )
        })
      }/>
      <Stack.Screen name="add" />
      <Stack.Screen name="settings/[name]" options={
        ({ route }) => ({
          title: decodeURIComponent(route.params?.name)+" Settings" || "Custom Tracker Settings",
          headerTitleAlign: "left",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12, paddingRight:16 }}>
              <Feather name="arrow-left" size={24} color={theme === "dark" ? "#fff" : "black"} />
            </Pressable>
          )
        })
      } />
    </Stack>
  );
}
