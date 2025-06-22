import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';
import { useState, useCallback } from 'react';
import * as SQLite from 'expo-sqlite/next';
import { Tracker, Field } from '@/types';
import { Card } from '@/components/Card';
import { useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DetailsScreen() {
  const { name } = useLocalSearchParams() as { name: string };
  const [fields, setFields] = useState([] as Field[]);
  const [trackerData, setTrackerData] = useState<any[]>([]); // Adjust type as needed
  // const [fieldValues, setFieldValues] = useState<{ [fieldId: number]: any }>({});
  
  useFocusEffect(
    useCallback(() => {
      const getTracker = async () => {
        const customTrackersDB = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
        const result = await customTrackersDB.getFirstAsync(
          `SELECT * FROM trackers WHERE name = ?`, [name]) as Tracker;
        if (!result) {
          console.error("Tracker not found");
          return;
        }
        console.log("Tracker found:", result);
        setFields(await customTrackersDB.getAllAsync(`SELECT * FROM fields WHERE trackerId = ?`, [result.id]))
        console.log("Tracker ID:", result.id);

        const db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
        const trackerData = await db.getAllAsync(
          `SELECT * FROM tracker_${result.id}`
        );
        if (trackerData) {
          setTrackerData(trackerData);
          console.log("Tracker data:", trackerData);
        }    
      };
      getTracker().catch((error) => {
        console.error("Error fetching tracker:", error);
      });

      // No cleanup needed
      return;
    }, [name])
  );

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <ScrollView contentContainerStyle={styles.container}>
        {trackerData.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <Text style={{ fontSize: 18 }}>
              No data available for this tracker. Please add some entries.
            </Text>
          </View>
        )}
        {trackerData.map((data, index) => (
          <Card 
            key={index}
            style={{ marginBottom: 16, padding: 16, width: '100%', flexDirection: 'column', alignSelf:"center" }}  
          >
            {/* // show created_at */}
            <View style={{borderBottomWidth: 1, borderBottomColor: "#222", paddingBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {data.created_at
                  ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                    " " +
                    new Date(data.created_at).toLocaleDateString()
                  : "No date available"}
              </Text>
            </View>
            {/* Render data content here if needed */}
            {fields.map((field) => (
              <View key={field.id} style={styles.fieldContainer}>
                <Text style={{ fontWeight: 'bold' }}>{field.name}:</Text>
                <Text>{field.type=="boolean" ? 
                  (data[field.name]?
                  <FontAwesome name="check-square" size={24} color="green" />
                  :<FontAwesome name="close" size={24} color="red" />) 
                  :data[field.name]}</Text>
              </View>
            ))}
          </Card>
        ))}
      </ScrollView>
      {/* Floating Plus Button */}
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