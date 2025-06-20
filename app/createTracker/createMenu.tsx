import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import * as SQLite from 'expo-sqlite';
import { router } from "expo-router";

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
    
    async function saveTracker() {
        if (trackerName.trim() === "") {
            alert("Tracker name cannot be empty");
            return;
        }
        if (fields.length === 0) {
            alert("At least one field is required");
            return;
        }

        try {
            const db = await SQLite.openDatabaseAsync("Trackers.db");
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
            });
            alert("Tracker saved successfully!");
        } catch (error) {
            console.error("Error saving tracker:", error);
            alert("Failed to save tracker. Please try again.");
        }
        router.navigate("/");
    }
    return (
        <View style={{flex: 1, margin: 20, justifyContent: "flex-start", flexDirection: 'column',position:"relative"}}>
            <TextInput 
                    placeholder="Name"
                    value={trackerName}
                    onChangeText={setTrackerName}
                    style={{marginTop:10,borderWidth:1,padding:5}}
            />
            {fields && fields.map((field, index) => (
                <View key={index} style={{marginVertical: 5}}>
                    <Text>{field.name} ({field.type})</Text>
                </View>
            ))}
            <TouchableOpacity
                style={{
                    backgroundColor: "#4630EB",
                    padding: 6, // reduced from 10
                    marginTop: 20,
                    borderRadius: 10,
                    width: "100%"
                }}
                onPress={() => setShowCreate(!showCreate)}
            >
                <Text style={{color: "white", textAlign: "center", fontSize: 15, fontWeight: "bold"}}>Add field</Text>
            </TouchableOpacity>

            {showCreate &&
                <View style={{marginTop:20, flex:1}}>
                    <TextInput 
                        placeholder="Field Name"
                        value={fieldName}
                        onChangeText={setFieldName}
                        style={{marginTop:10,borderWidth:1,padding:5}}
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
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginTop: 10}} // reduced height
                        labelField="label"
                        valueField="value"
                        onChange={item => {
                            setFieldType(item.value as FieldType);
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#4630EB",
                            padding: 6, // reduced from 10
                            marginTop: 20,
                            borderRadius: 10,
                            width: "100%"
                        }}
                        onPress={() => {
                            if (trackerName.trim() === "") {
                                alert("Field name cannot be empty");
                                return;
                            }
                            setFields([...fields, {name: fieldName, type: fieldType}]);
                            setShowCreate(false);
                            setFieldName('');
                        }}>
                        <Text style={{fontSize:15, fontWeight:"bold",color:"white", textAlign:"center"}}>Save Field</Text>
                    </TouchableOpacity>
                </View>
            }
            <TouchableOpacity onPress={saveTracker} style={{
                backgroundColor:"#4630EB",
                padding:6, // reduced from 10
                marginTop:20,
                borderRadius:10,
                position:"absolute",
                bottom:0,
                width:"100%"
            }}>
                <Text style={{color:"white",textAlign:"center",fontSize:15}}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}