import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
        const db = await SQLite.openDatabaseAsync('MeTracker');
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
        <View style={{
            flex: 1,
            padding:20,
            justifyContent: "flex-start",
            flexDirection: 'column',
        }}>
            <Dropdown
                data={dropdownData}
                value={value}
                style={{height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10}}
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
            <View style={{marginTop:20, flex:1}}>
                <TextInput 
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={{marginTop:10,borderWidth:1,padding:5}}
                />
                <TextInput 
                    placeholder="Caffeine (mg)"
                    value={caffeine}
                    onChangeText={setCaffeine}
                    keyboardType="numeric"
                    style={{marginTop:10,borderWidth:1,padding:5}}
                />
                <TouchableOpacity style={{position:"absolute", bottom:0, width:"100%", borderRadius:10,
                    backgroundColor:"#4630EB", padding:10, marginTop:10, alignItems:"center"}}
                    onPress={async () => {
                        const db = await SQLite.openDatabaseAsync('MeTracker');
                        await db.runAsync('INSERT INTO caffeine_drinks (name, caffeine) VALUES (?, ?)', [name, parseInt(caffeine)]);
                        updateDropdown();
                        setShowCreate(false);
                        setCaffeine('');
                        setName('');
                }}>
                    <Text style={{fontSize:20, fontWeight:"bold",color:"white"}}>Save</Text>
                </TouchableOpacity>
            </View>
            }
            {showAdd &&
            <View style={{marginTop:20}}>
                <TouchableOpacity style={{width:"100%",
                    backgroundColor:"#4630EB", padding:10, marginTop:10, alignItems:"center",borderRadius:10}}
                    onPress={ async () => {
                        if(selectedDrink){
                            const db = await SQLite.openDatabaseAsync('MeTracker');
                            await db.runAsync('CREATE TABLE IF NOT EXISTS caffeine_intakes (time DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP, name TEXT, amount INTEGER)');
                            await db.runAsync('INSERT INTO caffeine_intakes (name, amount) VALUES (?, ?)', [selectedDrink.name, selectedDrink.caffeine]);
                            console.log("Added", selectedDrink);
                            db.closeSync();
                            router.navigate("/caffeine/logs")
                        }
                }}>
                    <Text style={{fontSize:20, fontWeight:"bold",color:"white"}}>Add</Text>
                </TouchableOpacity>
            </View>
            }

        </View>
    );
}