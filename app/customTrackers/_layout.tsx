import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
      }}
    >
      <Stack.Screen name="[name]" options={
        ({ route }) => ({
          title: route.params?.name || "Custom Tracker",
          headerTitleAlign: "left",
        })
      }/>
      <Stack.Screen name="add" />
    </Stack>
  );
}
