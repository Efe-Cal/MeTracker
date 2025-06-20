import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="[name]" options={
        ({ route }) => ({
          title: route.name || "Custom Tracker",
          headerShown: true,
          headerTitleAlign: "center"
        })
      }/>
      <Stack.Screen name="add" />
    </Stack>
  );
}
