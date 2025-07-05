import { useLocalSearchParams, } from 'expo-router';
import { View, StyleSheet, ScrollView, Alert, ToastAndroid } from 'react-native';
import { router } from 'expo-router';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';
import { useState, useCallback, useContext } from 'react';
import * as SQLite from 'expo-sqlite/next';
import { Tracker, Field } from '@/types';
import { Card } from '@/components/Card';
import { useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemedText } from '@/components/ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';

export default function CustomTracker() {
  const { name } = useLocalSearchParams() as { name: string };
  const [fields, setFields] = useState([] as Field[]);
  const [trackerData, setTrackerData] = useState<any[]>([]); // Adjust type as needed
  const { theme } = useContext(ThemeContext);
  const [trackerID, setTrackerID] = useState<number | null>(null);
  
  useFocusEffect(
    useCallback(() => {
      const getTracker = async () => {
        let customTrackersDB: SQLite.SQLiteDatabase | null = null;
        try {
          customTrackersDB = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
          const result = await customTrackersDB.getFirstAsync(
            `SELECT * FROM trackers WHERE name = ?`, [encodeURI(name as string)]) as Tracker;
          if (!result) {
            console.error("Tracker not found asdasdsa");
            return;
          }
          console.log("Tracker found:", result);
          setFields(await customTrackersDB.getAllAsync(`SELECT * FROM fields WHERE trackerId = ?`, [result.id]))
          console.log("Tracker ID:", result.id);
          setTrackerID(result.id);

          const db2 = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
          const trackerData = await db2.getAllAsync(
            `SELECT * FROM ${result.isSubstanceTracker ? "substance_" : ""}tracker_${result.id}`
          );
          if (trackerData) {
            setTrackerData(trackerData);
            console.log("Tracker data:", trackerData);
          }
          await db2.closeAsync();
        } catch (error) {
          console.error("Error fetching tracker:", error);
        } finally {
          await customTrackersDB?.closeAsync();
        }
      };
      getTracker();
    }, [name])
  );

  return (
    <View style={{flex: 1, backgroundColor: theme === "dark" ? "#18181b" : "#fff"}}>
      <ScrollView contentContainerStyle={styles.container}>
        {trackerData.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <ThemedText style={{ fontSize: 18 }}>
              No data available for this tracker. Please add some entries.
            </ThemedText>
          </View>
        )}
        {trackerData.map((data, index) => (
          <Card 
            key={index}
            style={{ marginBottom: 16, padding: 16, width: '100%', flexDirection: 'column', alignSelf:"center" }}  
            onSwipe={(direction) => {
              Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
                {text: "Cancel", style: "cancel"},
                {
                  text: "Delete", style: "destructive",
                  onPress: async () => {  
                    let db: SQLite.SQLiteDatabase | null = null;
                    try {
                      db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
                      console.log("Deleting entry with ID:", data);
                      await db.runAsync(`DELETE FROM tracker_${trackerID} WHERE created_at = ?`, [data.created_at]);
                      setTrackerData((prevData) => prevData.filter((item) => item.created_at !== data.created_at));
                      ToastAndroid.show("Entry deleted successfully", ToastAndroid.SHORT);
                    } catch (error) {
                      console.error("Error deleting entry:", error);
                      ToastAndroid.show("Failed to delete entry", ToastAndroid.SHORT);
                    } finally {
                      await db?.closeAsync();
                    }
                  }
                }
              ]);
            }}
          >
            {/* // show created_at */}
            <View style={{borderBottomWidth: 1, borderBottomColor: "#222", paddingBottom: 8 }}>
              <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>
                {data.created_at
                  ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                    " " +
                    new Date(data.created_at).toLocaleDateString()
                  : "No date available"}
              </ThemedText>
            </View>
            {/* Render data content here if needed */}
            {fields.map((field) => (
              <View key={field.id} style={styles.fieldContainer}>
                <ThemedText style={{ fontWeight: 'bold' }}>{field.name}:</ThemedText>
                <ThemedText>
                  {field.type=="boolean" ? 
                    (data[field.name]?
                      <FontAwesome name="check-square" size={24} color="green" />
                      :<FontAwesome name="close" size={24} color="red" />) 
                    :data[field.name]}
                </ThemedText>
              </View>
            ))}
          </Card>
        ))}
      </ScrollView>
      <FloatingPlusButton onPress={() => router.navigate({ pathname: '/customTrackers/add', params: { name } })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    width: "100%",
    padding: 16
  },
  fieldContainer: {
    width: "100%",
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  }
});