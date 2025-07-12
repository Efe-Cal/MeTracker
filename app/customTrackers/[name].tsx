import { useLocalSearchParams, } from 'expo-router';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { router } from 'expo-router';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';
import { useState, useCallback, useContext, useEffect } from 'react';
import * as SQLite from 'expo-sqlite/next';
import { Tracker, Field } from '@/types';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';
import { Calendar } from 'react-native-calendars'
import { Ionicons } from '@expo/vector-icons';
import ThemedDropdown from '@/components/ThemedDropdown';
import { ThemedView } from '@/components/ThemedView';
import CustomTrackerLogCard from '@/components/CustomtTrackerLogCard';


export default function CustomTracker() {
  const { name } = useLocalSearchParams() as { name: string };
  const [ fields, setFields ] = useState([] as Field[]);
  const [ trackerData, setTrackerData ] = useState<any[]>([]); // Adjust type as needed
  const { theme } = useContext(ThemeContext);
  const [ trackerID, setTrackerID ] = useState<number | null>(null);
  const [ showCalendar, setShowCalendar ] = useState(false);
  const [ selectedField, setSelectedField ] = useState<Field | null>(null);
  const [ selectedOperator, setSelectedOperator ] = useState<string | null>(null);
  const [ inputValue, setInputValue ] = useState<string>("");
  const [ markedDates, setMarkedDates ] = useState<{[key: string]: {dots:{key:string, color:string}[]}}>({});
  const [ allowedOperators, setAllowedOperators ] = useState<{label:string,value:string}[]>([]);
  const [ selectedDate, setSelectedDate ] = useState<string | null>(null);
  const [ selectedDateEntries, setSelectedDateEntries ] = useState<any[]>([]);

  const allOperators = [
    {"label": "<", "value": "<"},
    {"label": ">", "value": ">"},
    {"label": "≤", "value": "<="},
    {"label": "≥", "value": ">="},
    {"label": "=", "value": "="},
    {"label": "≠", "value": "!="}
  ]

  useEffect(()=>{
    if (selectedDate) {
      const entries = trackerData.filter(data => {
        const date = new Date(data.created_at);
        const dateString = date.toISOString().split('T')[0];

        const hasDot = markedDates.hasOwnProperty(dateString) &&
          markedDates[dateString].dots.some(dot => dot.key === data.created_at && dot.color === '#7c5cff');

        return (dateString === selectedDate && hasDot);
      });
      setSelectedDateEntries(entries);
      console.log("Selected date entries:", entries);
    } else {
      setSelectedDateEntries([]);
    }

  },[markedDates, selectedDate, trackerData]);


  const updateMarkedDates = useCallback(() => {
    console.log(selectedField)
    var newMarkedDates: { [key: string]: { dots: { key: string, color: string }[] } } = {};
    newMarkedDates = trackerData.reduce((acc, data) => {
      const date = new Date(data.created_at);
      const dateString = date.toISOString().split('T')[0];
      if (!acc[dateString]) {
        acc[dateString] = { dots: [] };
      }
      if (selectedField && selectedOperator && inputValue) {
        const fieldValue = data[selectedField.name];

        if (selectedField.type === "boolean") {
          if (selectedOperator === "=") {
            console.log("Field value:", fieldValue, "Input value:", inputValue.toLowerCase() == "true");
            if (!!(fieldValue) == (inputValue.toLowerCase() == "true")) {
              acc[dateString].dots.push({
                key: data.created_at,
                color: '#7c5cff',
              });
            }
            return acc;
          } else if (selectedOperator === "!=") {
            if (!!(fieldValue) != (inputValue.toLowerCase() == "true")) {
              acc[dateString].dots.push({
                key: data.created_at,
                color: '#7c5cff',
              });
            }
            return acc;
          }
        }
        if (selectedField.type === "number" ) {
          let conditionMet = false;
          switch (selectedOperator) {
            case '<':
              conditionMet = fieldValue < parseFloat(inputValue);
              break;
            case '>':
              conditionMet = fieldValue > parseFloat(inputValue);
              break;
            case '<=':
              conditionMet = fieldValue <= parseFloat(inputValue);
              break;
            case '>=':
              conditionMet = fieldValue >= parseFloat(inputValue);
              break;
            case '=':
              conditionMet = fieldValue == inputValue;
              break;
            case '!=':
              conditionMet = fieldValue != inputValue;
              break;
            default:
              conditionMet = false;
          }
          if (!conditionMet) return acc; // Skip if condition is not met
          acc[dateString].dots.push({
            key: data.created_at,
            color: '#7c5cff',
          });
        }
        if (selectedField.type === "text") {
          const fieldValueString = String(fieldValue).toLowerCase();
          const inputValueString = inputValue.toLowerCase();
          let conditionMet = false;
          switch (selectedOperator) {
            case '=':
              conditionMet = fieldValueString === inputValueString;
              break;
            case '!=':
              conditionMet = fieldValueString !== inputValueString;
              break;
            default:
              Alert.alert("Invalid operator for text field");
              conditionMet = false;
          }
          if (!conditionMet) return acc; // Skip if condition is not met
          acc[dateString].dots.push({
            key: data.created_at,
            color: '#7c5cff',
          });
        }
        if (selectedField.type === "select") {
          const fieldValueString = String(fieldValue).toLowerCase();
          const inputValueString = inputValue.toLowerCase();
          let conditionMet = false;
          switch (selectedOperator) {
            case '=':
              conditionMet = fieldValueString === inputValueString;
              break;
            case '!=':
              conditionMet = fieldValueString !== inputValueString;
              break;
            default:
              Alert.alert("Invalid operator for select field");
              conditionMet = false;
          }
          if (!conditionMet) return acc; // Skip if condition is not met
          acc[dateString].dots.push({
            key: data.created_at,
            color: '#7c5cff',
          });
        }
      }
      return acc;
    }, {});
    console.log("New marked dates:", newMarkedDates);
    setMarkedDates(newMarkedDates);
  }, [trackerData, selectedField, selectedOperator, inputValue]);

  const updateOperators = useCallback(() => {
    if (selectedField?.type=="boolean" || selectedField?.type=="select" || selectedField?.type=="text") {
      setAllowedOperators(allOperators.filter(op => op.value === "=" || op.value === "!="));
      return;
    }
    if (selectedField?.type=="number") {
      setAllowedOperators(allOperators);
      return;
    }
    setAllowedOperators(allOperators);
  }, [selectedField]);

  useEffect(() => {
    updateMarkedDates();
    updateOperators();
  }, [updateMarkedDates, updateOperators]);

  useFocusEffect(
    useCallback(() => {
      const getTracker = async () => {
        let customTrackersDB: SQLite.SQLiteDatabase | null = null;
        try {
          customTrackersDB = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
          const result = await customTrackersDB.getFirstAsync(
            `SELECT * FROM trackers WHERE name = ?`, [name]) as Tracker;
          if (!result) {
            console.error("Tracker not found asdasdsa");
            return;
          }
          console.log("Tracker found:", result);

          const fields = await customTrackersDB.getAllAsync(`SELECT * FROM fields WHERE trackerId = ?`, [result.id]) as Field[];
          console.log("Fields fetched:");
          console.log("Fields:", fields);
          setFields(fields || []);
          console.log("Tracker ID:", result.id);
          setTrackerID(result.id);
          for (const field of fields) {
            if (field.type === "select") {
              let options = await customTrackersDB.getAllAsync(`SELECT option FROM tracker_${result.id}_select_options WHERE fieldId = ?`, [field.id]) as { option: string }[];
              // put options in field.options
              field.options = options.map((option) => option.option);
            }
          }

          const db2 = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
          const trackerData = await db2.getAllAsync(
            `SELECT * FROM ${result.isSubstanceTracker ? "substance_" : ""}tracker_${result.id}`
          );
          if (trackerData) {
            setTrackerData(trackerData.reverse());
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
  const screenWidth = Dimensions.get('window').width;
  return (
    <ThemedView style={{flex: 1 }}>
      <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={{ padding: 16, alignItems: 'center', flexDirection:"row", justifyContent:"flex-end", paddingBottom:0}}>
        <Ionicons name={showCalendar ? "list" : "calendar-outline"} size={23} color={theme === "dark" ? "#fff" : "#000"} />
        <ThemedText style={{ marginLeft:3,fontSize: 18, color: theme === "dark" ? "#fff" : "#000" }}>
          {showCalendar ? "Show List View" : "Show Calendar View"}
        </ThemedText>
      </TouchableOpacity>
      {!showCalendar ? (
        <ScrollView contentContainerStyle={[styles.container,{flexDirection: 'column', alignItems: 'center'}]}>
          {trackerData.length === 0 && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
              <ThemedText style={{ fontSize: 18 }}>
                No data available for this tracker. Please add some entries.
              </ThemedText>
            </View>
          )}
          {trackerData.map((data, index) => (
            <CustomTrackerLogCard
              key={index}
              index={index}
              data={data}
              trackerID={String(trackerID)}
              fields={fields}
              setTrackerData={setTrackerData}
            />
          ))}
        </ScrollView>
      ):
      (
        <ThemedView style={[styles.container, { flexDirection: 'column', alignItems: 'center', flex: 1 }]}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: (screenWidth * 0.9) - 32,
            marginBottom: 8,
          }}>
            <ThemedDropdown
              style={{
                width: ((screenWidth * 0.9) - 32) * 0.3,
                marginBottom: 16,
              }}
              data={fields.map(field => ({
                label: field.name,
                value: field.name,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select a field"
              onChange={(item) => {
                setSelectedField(fields.filter(f => f.name === item.value)[0] || null);
                setSelectedOperator(null);
                setInputValue("");
              }}
              value={selectedField ? selectedField.name : ""}
            />
            <ThemedDropdown
              style={{
                width: ((screenWidth * 0.9) - 32) * 0.3,
                marginBottom: 16,
              }}
              data={allowedOperators}
              labelField={"label"}
              valueField={"value"}
              value={selectedOperator||""}
              onChange={(item) => {
                setSelectedOperator(item.value);
              }}
              placeholder='Select an operator'
            />
            { selectedField?.type== "boolean" ? (
              <ThemedDropdown
                style={{
                  width: ((screenWidth * 0.9) - 32) * 0.3,
                  marginBottom: 16,
                }}
                data={[
                  { label: "True", value: "true" },
                  { label: "False", value: "false" }
                ]}
                labelField={"label"}
                valueField={"value"}
                value={inputValue}
                onChange={(item) => {
                  setInputValue(item.value);
                }}
                placeholder='Select a value'
              />
            ):((selectedField?.type==="select" && selectedField.options) ? ( 
              <ThemedDropdown
                style={{
                  width: ((screenWidth * 0.9) - 32) * 0.3,
                  marginBottom: 16,
                }}
                data={selectedField.options.map(option => ({
                  label: option,
                  value: option,
                }))}
                labelField={"label"}
                valueField={"value"}
                value={inputValue}
                onChange={(item) => {
                  setInputValue(item.value);
                }}
                placeholder='Select a value'
              />
            ):(
            <TextInput
              style={{
                width: ((screenWidth * 0.9) - 32) * 0.3,
                borderRadius: 10,
                padding: 10,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#444" : "#ccc",
                marginBottom: 16,
                backgroundColor: theme === "dark" ? "#23232b" : "#f8f9fa",
                color: theme === "dark" ? "#fff" : "#222"
              }}
              placeholder="Enter value"
              placeholderTextColor={theme === "dark" ? "#bbb" : "#888"}
              onChangeText={(text) => setInputValue(text)}
              value={inputValue}
              keyboardType={selectedField?.type === "number" ? "numeric" : "default"}
            />
            ))} 
          </View>
          <Calendar
            style={{
              width: (screenWidth * 0.9) - 32,
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: theme === "dark" ? "#444" : "#ccc",
              backgroundColor: theme === "dark" ? "#18181b" : "#fff"
            }}
            theme={{
              backgroundColor: theme === "dark" ? "#18181b" : "#fff",
              calendarBackground: theme === "dark" ? "#18181b" : "#fff",
              textSectionTitleColor: theme === "dark" ? "#e5e7eb" : "#222",
              selectedDayBackgroundColor: '#7c5cff',
              selectedDayTextColor: '#fff',
              todayTextColor: '#7c5cff',
              dayTextColor: theme === "dark" ? "#fff" : "#222",
              textDisabledColor: theme === "dark" ? "#444" : "#d9e1e8",
              arrowColor: theme === "dark" ? "#fff" : "#7c5cff",
              monthTextColor: theme === "dark" ? "#fff" : "#222",
              indicatorColor: theme === "dark" ? "#fff" : "#222",
              textDayFontWeight: "400",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "400",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            markingType={'multi-dot'}
            markedDates={{
              ...markedDates,
              ...(selectedDate ? { [selectedDate]: { ...(markedDates[selectedDate] || {}), selected: true, marked:true, selectedColor:"#395fc086"} } : {})
            }}
            onDayPress={(day:any) => {
              console.log("Selected day:", day);
              setSelectedDate(day.dateString);
            }}
          />
          { selectedDate && selectedField && selectedOperator && inputValue ? (
            <ScrollView
            style={{width: (screenWidth * 0.9) - 32, marginTop: 8, padding:3, }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            >
              {selectedDateEntries.map((data, index) => (
                <CustomTrackerLogCard
                  key={index}
                  index={index}
                  data={data}
                  trackerID={String(trackerID)}
                  fields={fields}
                  setTrackerData={setTrackerData}
                />
              ))}
            </ScrollView>
            ):null}
        </ThemedView>
      )}
      
      <FloatingPlusButton onPress={() => router.navigate({ pathname: '/customTrackers/add', params: { name } })} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    width: "100%",
    padding: 16,
    flex:1
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