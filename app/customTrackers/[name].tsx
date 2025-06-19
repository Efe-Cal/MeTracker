import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen() {
  const { name } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>{name} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});