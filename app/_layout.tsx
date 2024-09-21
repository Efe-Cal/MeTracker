import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Link, usePathname } from 'expo-router';

import { Feather } from '@expo/vector-icons';

export default function Layout() {
  const path = usePathname();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'MeTracker',
          }}
        />
        <Drawer.Screen
          name="caffeine" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Caffeine Tracker',
            title: 'Caffeine Tracker',
          }}
        />
        <Drawer.Screen
          name="toilet" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Toilet logs',
            title: 'Toilet logs',
            headerRight: () => (path.includes("logs")?
            <Link href="/toilet/add" style={{padding:10}}><Feather name="plus" size={24} color="black" /></Link>
            :<Link href="/toilet/logs" style={{padding:10}}><Feather name="file-text" size={24} color="black" /></Link>),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}