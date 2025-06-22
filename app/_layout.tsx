import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { Pressable } from 'react-native';

export default function Layout() {
  const [customScreens, setCustomScreens] = useState<{ name: string }[]>([]);

  // useEffect(() => {
  //   let isMounted = true;
  //   (async () => {
  //     const db = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
  //     const rows = await db.getAllAsync<{ name: string }>(`SELECT name FROM Trackers`);
  //     // rows is an array of objects with a 'name' property
  //     if (isMounted) setCustomScreens(rows || []);
  //   })();
  //   return () => { isMounted = false; };
  // }, []);
  useEffect(() => {
      setCustomScreens([{name: "a"}, {name: "b"}]);
    }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Feather name="arrow-left" size={24} color="black" />
              </Pressable>
            ) : null
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "MeTracker Home",
            headerLeft: () => null
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
    </GestureHandlerRootView>
  );
}