import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome to the MeTracker.</Text> 
      <Text>This app lets you keep track of your health.</Text>
    </View>
  );
}
