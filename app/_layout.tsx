import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Link, usePathname, router } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { Feather } from '@expo/vector-icons';

export default function Layout() {
  const path = usePathname();
  const [customScreens, setCustomScreens] = useState<{ name: string }[]>([]);

  // useEffect(() => {
  //   let isMounted = true;
  //   (async () => {
  //     const db = await SQLite.openDatabaseAsync("Trackers.db");
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
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'MeTracker',
          }}
        />
        <Drawer.Screen
          name="caffeine"
          options={{
            drawerLabel: 'Caffeine Tracker',
            title: 'Caffeine Tracker',
            headerRight: () => (!path.includes("add")?
            <Link href="/caffeine/add" style={{padding:10}}><Feather name="plus" size={24} color="black" /></Link>
            :<Link href="/caffeine/logs" style={{padding:10}}><Feather name="file-text" size={24} color="black" /></Link>),
          }}
        />
        <Drawer.Screen
          name="toilet"
          options={{
            drawerLabel: 'Toilet logs',
            title: 'Toilet logs',
            headerRight: () => (path.includes("logs")?
            <Link href="/toilet/add" style={{padding:10}}><Feather name="plus" size={24} color="black" /></Link>
            :<Link href="/toilet/logs" style={{padding:10}}><Feather name="file-text" size={24} color="black" /></Link>),
          }}
        />
        <Drawer.Screen
          name="createTracker"
          options={{
            drawerLabel: 'Create Tracker',
            title: 'Create Tracker',
          }}
        />
        
        <Drawer.Screen
          name={`customTrackersList`}
          options={{
            drawerLabel: 'Custom Trackers',
            title: 'Custom Trackers',
            headerRight: () => (
              <Link href="/createTracker" style={{ padding: 10 }}>
                <Feather name="plus" size={24} color="black" />
              </Link>
            ),
          }}
        />
        <Drawer.Screen
          name={"customTrackers/[name]"}
          options={{
            title: 'Custom Tracker',
            drawerItemStyle: { display: 'none' }, // Hide this screen from the drawer
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}