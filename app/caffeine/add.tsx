import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { router } from 'expo-router';

type Drink = {
    name: string,
    caffeine: number,
}

export default function Add() {
    const [value, setValue] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState('');
    const [caffeine, setCaffeine] = useState('');
    const [dropdownData, setDropdownData] = useState<{label: string, value: string}[]>([{label: 'Create new drink', value: 'create'}]);
    const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    const updateDropdown = async () => {
        const data = [{label: 'Create new drink', value: 'create'}];
        const db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
        // create table if not exists
        await db.runAsync('CREATE TABLE IF NOT EXISTS caffeine_drinks (name TEXT PRIMARY KEY, caffeine INTEGER)');
        const result = await db.getAllAsync('SELECT * FROM caffeine_drinks');
        for(const row of result as Drink[]){
            data.push({label: row.name, value: row.name+";"+row.caffeine});
        }
        setDropdownData(data);
    }
    useEffect(() => {
        updateDropdown();
    }, []);

    return (
        <View style={styles.container}>
            <Dropdown
                data={dropdownData}
                value={value}
                style={styles.dropdown}
                labelField="label"
                valueField="value"
                onChange={item =>{
                    setValue(item.value)
                    if(item.value === 'create'){
                        setShowCreate(true);
                        setShowAdd(false);
                    }
                    else{
                        setShowAdd(true);
                        setShowCreate(false);
                        setSelectedDrink({name: item.label, caffeine: parseInt(item.value.split(";")[1])});
                    }
                }}
            />
            {showCreate && 
            <View style={styles.createView}>
                <TextInput 
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput 
                    placeholder="Caffeine (mg)"
                    value={caffeine}
                    onChangeText={setCaffeine}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.saveButton}
                    onPress={async () => {
                        const db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
                        await db.runAsync('INSERT INTO caffeine_drinks (name, caffeine) VALUES (?, ?)', [name, parseInt(caffeine)]);
                        updateDropdown();
                        setShowCreate(false);
                        setCaffeine('');
                        setName('');
                        setValue(name + ";" + caffeine);
                        setSelectedDrink({name, caffeine: parseInt(caffeine)});
                        setShowAdd(true);
                }}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
            }
            {showAdd &&
            <View style={styles.addView}>
                <TouchableOpacity style={styles.addButton}
                    onPress={ async () => {
                        if(selectedDrink){
                            const db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
                            await db.runAsync('CREATE TABLE IF NOT EXISTS caffeine_intakes (time DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP, name TEXT, amount INTEGER)');
                            await db.runAsync('INSERT INTO caffeine_intakes (name, amount) VALUES (?, ?)', [selectedDrink.name, selectedDrink.caffeine]);
                            console.log("Added", selectedDrink);
                            db.closeSync();
                            router.navigate("/caffeine/logs")
                        }
                }}>
                    <Text style={styles.saveButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    addButton: {
        alignItems: "center",
        backgroundColor: "#4630EB",
        borderRadius: 10,
        marginTop: 10,
        padding: 10,
        width: "100%"
    },
    addView: {
        marginTop: 20
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        padding: 20
    },
    createView: {
        flex: 1,
        marginTop: 20
    },
    dropdown: {
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 1,
        height: 50,
        paddingHorizontal: 10
    },
    input: {
        borderWidth: 1,
        marginTop: 10,
        padding: 5
    },
    saveButton: {
        alignItems: "center",
        backgroundColor: "#4630EB",
        borderRadius: 10,
        bottom: 0,
        marginTop: 10,
        padding: 10,
        position: "absolute",
        width: "100%"
    },
    saveButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    }
});