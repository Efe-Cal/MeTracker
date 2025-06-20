import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';

export default function DetailsScreen() {
  const { name } = useLocalSearchParams();
  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
      </View> */}
      <View style={styles.container}>
        
      </View>
      {/* Floating Plus Button */}
      <FloatingPlusButton onPress={() => router.navigate({ pathname: '/customTrackers/add', params: { name } })} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    minHeight: 80
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 4
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    width: "100%",
    padding: 16
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#4630EB',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10
  }
});