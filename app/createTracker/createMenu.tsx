import { useState, useContext } from "react";
import { View, TextInput, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import * as SQLite from 'expo-sqlite';
import { router } from "expo-router";
import { ThemeContext } from "@/theme/ThemeContext";
import { ThemedText } from "@/components/ThemedText";
import Entypo from '@expo/vector-icons/Entypo';

type FieldType = "text" | "number" | "boolean" | "select" | "substance";

type TrackerField = {
    name: string;
    type: FieldType;
    options?: string[];
}

export default function createTracker() {
    const [trackerName, setTrackerName] = useState("");
    const [fields, setFields] = useState<TrackerField[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [fieldType, setFieldType] = useState<FieldType>("text");
    const [fieldName, setFieldName] = useState("");
    const { theme } = useContext(ThemeContext);
    const [showCreateSelectOption, setShowCreateSelectOption] = useState(false);
    const [selectOptions, setSelectOptions] = useState<string[]>([]);

    async function saveTracker() {
        if (trackerName.trim() === "") {
            ToastAndroid.show("Tracker name cannot be empty", ToastAndroid.SHORT);
            return;
        }
        if (fields.length === 0) {
            ToastAndroid.show("At least one field is required", ToastAndroid.SHORT);
            return;
        }

        try {
            const customTrackersDB = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
            await customTrackersDB.withTransactionAsync(async () => {
            await customTrackersDB.runAsync(`
                CREATE TABLE IF NOT EXISTS trackers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL
                );
            `);
            await customTrackersDB.runAsync(`
                CREATE TABLE IF NOT EXISTS fields (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    trackerId INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    FOREIGN KEY (trackerId) REFERENCES trackers(id)
                );
            `);

            const result = await customTrackersDB.runAsync('INSERT INTO trackers (name) VALUES (?);', [trackerName]);
            const trackerId = result.lastInsertRowId;

            for (const field of fields) {
                await customTrackersDB.runAsync('INSERT INTO fields (trackerId, name, type) VALUES (?, ?, ?);', [trackerId, field.name, field.type]);
            }
            const meTrackerDB = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
            // Build columns for CREATE TABLE
            const columns = fields
                .filter(f => f.name.trim() !== "")
                .map(f => {
                    let sqlType: string;
                    switch (f.type) {
                        case "number":
                            sqlType = "REAL";
                            break;
                        case "boolean":
                            sqlType = "BOOLEAN";
                            break;
                        case "text":
                            sqlType = "TEXT";
                            break;
                        case "select":
                            sqlType = "TEXT"; // Select fields will be stored as TEXT, options will be in a separate table
                            break;
                        case "substance":
                            // TODO: Handle select and substance types
                            sqlType = "TEXT";
                            break;
                        default:
                            sqlType = "TEXT";
                    }
                    return `${f.name.trim().replace(/[^a-zA-Z0-9_]/g, '_')} ${sqlType}`;
                })
                .join(",\n    ");
            await meTrackerDB.runAsync(
                `CREATE TABLE IF NOT EXISTS tracker_${trackerId} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP${columns ? ",\n    " + columns : ""}
                );`
            );
            await customTrackersDB.runAsync(`
                CREATE TABLE IF NOT EXISTS tracker_${trackerId}_select_options (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fieldId INTEGER NOT NULL,
                    option TEXT NOT NULL,
                    FOREIGN KEY (fieldId) REFERENCES fields(id)
                );
            `);
            for (const field of fields) {
                if (field.type === "select" && field.options && field.options.length > 0) {
                    // Fetch the correct fieldId for this field
                    const fieldIdResult = await customTrackersDB.getFirstAsync(
                        `SELECT id FROM fields WHERE trackerId = ? AND name = ?`,
                        [trackerId, field.name]
                    ) as { id: number } | undefined;
                    const fieldID = fieldIdResult?.id;
                    if (fieldID) {
                        for (const option of field.options) {
                            if (option.trim() !== "") {
                                await customTrackersDB.runAsync(
                                    `INSERT INTO tracker_${trackerId}_select_options (fieldId, option) VALUES (?, ?);`,
                                    [fieldID, option]
                                );
                            }
                        }
                    }
                }
            }
        });

        ToastAndroid.show("Tracker saved successfully!", ToastAndroid.SHORT);
        } catch (error) {
            console.error("Error saving tracker:", error);
            ToastAndroid.show("Failed to save tracker. Please try again.", ToastAndroid.SHORT);
        }
        router.navigate("/");
    }
    return (
        <View style={[styles.outer, { backgroundColor: theme === "dark" ? "#18181b" : "#fff" }]}>
            <ScrollView
                contentContainerStyle={[styles.container, { backgroundColor: theme === "dark" ? "#18181b" : "#fff" }]}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput 
                    placeholder="Name"
                    value={trackerName}
                    onChangeText={setTrackerName}
                    style={[
                        styles.input,
                        {
                            backgroundColor: theme === "dark" ? "#222" : "#fff",
                            color: theme === "dark" ? "#fff" : "#222",
                            borderColor: theme === "dark" ? "#444" : "#ccc"
                        }
                    ]}
                    placeholderTextColor={theme === "dark" ? "#888" : "#aaa"}
                />
                {fields && fields.map((field, index) => (
                    <View key={index} style={{marginVertical: 5, marginRight:10, flexDirection: "row", alignItems: "center"}}>
                        <Entypo name="dot-single" size={24} style={{marginTop:4}} color={theme==="dark"?"white":"black"} />
                        <ThemedText style={{ color: theme === "dark" ? "#fff" : "#222" }}>
                            {field.name} - {field.type}
                        </ThemedText>
                    </View>
                ))}
                <TouchableOpacity
                    style={[
                        styles.addFieldButton,
                        { backgroundColor: "#4630EB" }
                    ]}
                    onPress={() => setShowCreate(!showCreate)}
                >
                    <ThemedText style={styles.buttonText}>Add field</ThemedText>
                </TouchableOpacity>

                {showCreate &&
                    <View style={{marginTop:20, width: "100%"}}>
                        <TextInput 
                            placeholder="Field Name"
                            value={fieldName}
                            onChangeText={setFieldName}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme === "dark" ? "#222" : "#fff",
                                    color: theme === "dark" ? "#fff" : "#222",
                                    borderColor: theme === "dark" ? "#444" : "#ccc"
                                }
                            ]}
                            placeholderTextColor={theme === "dark" ? "#888" : "#aaa"}
                        />
                        <Dropdown
                            data={[
                                { label: 'Text', value: 'text' },
                                { label: 'Number', value: 'number' },
                                { label: 'Boolean', value: 'boolean' },
                                { label: 'Select', value: 'select' },
                                { label: 'Substance', value: 'substance' }
                            ]}
                            value={fieldType}
                            style={[
                                styles.dropdown,
                                {
                                    backgroundColor: theme === "dark" ? "#222" : "#fff",
                                    borderColor: theme === "dark" ? "#444" : "gray",
                                }
                            ]}
                            activeColor={theme === "dark" ? "#333" : "#e0e0e0"}
                            containerStyle={{
                                backgroundColor: theme === "dark" ? "#222" : "#fff",
                                borderColor: theme === "dark" ? "#444" : "gray",
                                borderRadius: 5,
                            }}
                            placeholderStyle={{ color: theme === "dark" ? "#888" : "#aaa" }}
                            selectedTextStyle={{ color: theme === "dark" ? "#fff" : "#222" }}
                            itemTextStyle={{ color: theme === "dark" ? "#fff" : "#222" }}
                            labelField="label"
                            valueField="value"
                            onChange={item => {
                                setFieldType(item.value as FieldType);
                                if (item.value === "select") {
                                    setShowCreateSelectOption(true);
                                    if (selectOptions.length === 0) setSelectOptions([""]);
                                } else {
                                    setShowCreateSelectOption(false);
                                    setSelectOptions([]);
                                }
                            }}
                        />
                        { showCreateSelectOption &&
                            <View style={{marginTop: 10}}>
                                {selectOptions.map((option, idx) => (
                                    <TextInput
                                        key={idx}
                                        placeholder={`Option ${idx + 1}`}
                                        value={option}
                                        onChangeText={text => {
                                            const newOptions = [...selectOptions];
                                            newOptions[idx] = text;
                                            // If last input is filled, add a new empty input
                                            if (
                                                idx === selectOptions.length - 1 &&
                                                text.trim() !== ""
                                            ) {
                                                newOptions.push("");
                                            }
                                            // Remove extra empty trailing inputs except the last one
                                            let lastNonEmpty = newOptions.length - 1;
                                            while (
                                                lastNonEmpty > 0 &&
                                                newOptions[lastNonEmpty].trim() === "" &&
                                                newOptions[lastNonEmpty - 1].trim() === ""
                                            ) {
                                                newOptions.pop();
                                                lastNonEmpty--;
                                            }
                                            setSelectOptions(newOptions);
                                        }}
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor: theme === "dark" ? "#222" : "#fff",
                                                color: theme === "dark" ? "#fff" : "#222",
                                                borderColor: theme === "dark" ? "#444" : "#ccc",
                                                marginBottom: 5,
                                            }
                                        ]}
                                        placeholderTextColor={theme === "dark" ? "#888" : "#aaa"}
                                    />
                                ))}
                            </View>
                        }
                        <TouchableOpacity
                            style={[
                                styles.saveFieldButton,
                                { backgroundColor: "#4630EB" }
                            ]}
                            onPress={() => {
                                if (trackerName.trim() === "") {
                                    ToastAndroid.show("Field name cannot be empty", ToastAndroid.SHORT);
                                    return;
                                }
                                if (fieldType === "select" && selectOptions.length === 0) {
                                    ToastAndroid.show("Select field must have at least one option", ToastAndroid.SHORT);
                                    return;
                                }
                                if (fieldType === "select"){
                                    setFields([...fields, {name: fieldName, type: fieldType, options: selectOptions}]);
                                }
                                else{ 
                                    setFields([...fields, {name: fieldName, type: fieldType}]);
                                }
                                setShowCreate(false);
                                setFieldName('');
                                setFieldType("text");
                                setSelectOptions([]);
                                setShowCreateSelectOption(false);
                                ToastAndroid.show("Field added successfully", ToastAndroid.SHORT);
                            }}>
                            <ThemedText style={styles.buttonText}>Save Field</ThemedText>
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
            <TouchableOpacity onPress={saveTracker} style={[styles.saveButton, { backgroundColor: "#4630EB" }]}>
                <ThemedText style={styles.buttonText}>Save</ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: "flex-start",
        flexDirection: 'column',
        position: "relative",
        padding: 20,
        paddingBottom: 80,
        minHeight: "100%",
    },
    input: {
        marginTop: 10,
        borderWidth: 1,
        padding: 5,
        borderRadius: 6,
        width: "100%",
    },
    dropdown: {
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        paddingHorizontal: 10,
        marginTop: 10,
        width: "100%",
    },
    addFieldButton: {
        padding: 6,
        marginTop: 20,
        borderRadius: 10,
        width: "100%"
    },
    saveFieldButton: {
        padding: 6,
        marginTop: 20,
        borderRadius: 10,
        width: "100%"
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
        textAlign: "center"
    },
    saveButton: {
        padding: 12,
        borderRadius: 10,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        margin: 15,
    },
});