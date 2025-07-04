import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState, useContext } from 'react';
import * as SQLite from 'expo-sqlite/next';
import { Tracker, Field } from '@/types';
import { BooleanField } from '@/components/BooleanField';
import { TextField } from '@/components/TextField';
import { NumberField } from '@/components/NumberField';
import { ThemedText } from '@/components/ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';
import SelectField from '@/components/SelectField';

export default function CustomTrackerAdd() {
  const { name } = useLocalSearchParams() as { name: string };
  const navigation = useNavigation();
  const [fields, setFields] = useState([] as Field[]);
  const [trackerID, setTrackerID] = useState<number | null>(null);
  const [fieldValues, setFieldValues] = useState<{ [fieldId: number]: any }>({});
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    // Set the screen title to the tracker name
    navigation.setOptions?.({ title: name });
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
      setTrackerID(result.id);
    };
    getTracker().catch((error) => {
      console.error("Error fetching tracker:", error);
    });
    
  }, []);

  async function handleSave() {

    const db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
    if (!trackerID) {
      console.error("Tracker ID is not set.");
      return;
    }
    // Assuume table tracker_${trackerID} table exists
    // Insert values into the tracker table
    const columns = fields.map((field) => field.name.trim().replace(/[^a-zA-Z0-9_]/g, '_')).join(", ");
    const placeholders = fields.map(() => "?").join(", ");
    const values = fields.map((field) => fieldValues[field.id] || null); // Use fieldValues to get the current values
    console.log(values);
    await db.runAsync(
      `INSERT INTO tracker_${trackerID} (${columns}) VALUES (${placeholders})`,
      values
    );
    router.back();
    console.log("Save button pressed with values:", fieldValues);
    // You can add logic to save fieldValues to the database or perform other actions
  }
  function renderField(field: Field) {
    switch (field.type) {
      case "boolean":
        return (
          <BooleanField
            key={field.id}
            label={field.name || "Boolean Field"}
            value={!!fieldValues[field.id]}
            onValueChange={(val) => setFieldValues((prev) => ({ ...prev, [field.id]: val }))}
          />
        );
      case "text":
        return (
          <TextField
            key={field.id}
            label={field.name || "Text Field"}
            value={fieldValues[field.id] || ""}
            onValueChange={(val) => setFieldValues((prev) => ({ ...prev, [field.id]: val }))}
          />
        );
      case "number":
        return (
          <NumberField
            key={field.id}
            label={field.name || "Number Field"}
            value={fieldValues[field.id] || ""}
            onValueChange={(val) => setFieldValues((prev) => ({ ...prev, [field.id]: val }))}
          />
        );
      case "select":
        if (!trackerID) {
          // console.error("Tracker ID is not set for select field.");
          return null;
        }
        return (
           <SelectField label={field.name} fieldName={field.name} trackerID={trackerID} onChange={(val) => setFieldValues((prev) => ({ ...prev, [field.id]: val }))}/>
        );
      default:
        return <ThemedText key={field.id}>Unsupported field type: {field.type}</ThemedText>;
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: theme === "dark" ? "#18181b" : "#fff"}}>
      <View style={styles.container}>
        {fields.length === 0 ? (
          <ThemedText>No fields defined for this tracker.</ThemedText>
        ) : (
          fields.map((field) => (
            <View key={field.id} style={styles.fieldContainer}>
              {renderField(field)}
            </View>
          ))
        )}
      </View> 
        <TouchableOpacity
            style={{ padding: 8, backgroundColor: '#4630EB', borderRadius: 8, margin: 16, }}
            onPress={() => {
            // Handle save logic here
            handleSave();
            }}
        >
          <ThemedText style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight:"bold" }}>Save</ThemedText>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    width: "100%",
    padding: 16
  },
  fieldContainer: {
    width: "100%",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  }
});