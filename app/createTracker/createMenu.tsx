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

type Field = {
    name: string;
    type: FieldType;
}

export default function createTracker() {
    const [trackerName, setTrackerName] = useState("");
    const [fields, setFields] = useState<Field[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [fieldType, setFieldType] = useState<FieldType>("text");
    const [fieldName, setFieldName] = useState("");
    const { theme } = useContext(ThemeContext);

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
            const db = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
            await db.withTransactionAsync(async () => {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS trackers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL
                );
            `);
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS fields (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    trackerId INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    FOREIGN KEY (trackerId) REFERENCES trackers(id)
                );
            `);

            const result = await db.runAsync('INSERT INTO trackers (name) VALUES (?);', [trackerName]);
            const trackerId = result.lastInsertRowId;

            for (const field of fields) {
                await db.runAsync('INSERT INTO fields (trackerId, name, type) VALUES (?, ?, ?);', [trackerId, field.name, field.type]);
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
                            // For select, we can use TEXT or INTEGER depending on how you want to store the options
                            sqlType = "TEXT"; // Assuming options will be stored as a comma-separated string or similar
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
                            }}
                        />
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
                                setFields([...fields, {name: fieldName, type: fieldType}]);
                                setShowCreate(false);
                                setFieldName('');
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