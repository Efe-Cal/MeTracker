import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
        screenOptions={{
            headerShown: false
        }}>
        <Stack.Screen name="logs" options={{}} />
        <Stack.Screen name="add" options={{}} />
        <Stack.Screen name="details" options={{}} />
    </Stack>
  );
}