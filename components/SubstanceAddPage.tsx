import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import { router } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import type { SubstanceItem } from '@/types';
import { ThemedDropdown } from '@/components/ThemedDropdown';
import { ThemedView } from './ThemedView';
import { getIntakesTableName } from '@/utils/sanitizeForSQL';
import { Colors } from '@/constants/Colors';

export default function SubstanceAddPage({ substanceName }: { substanceName: string }) {
    const [value, setValue] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [dropdownData, setDropdownData] = useState<{label: string, value: string}[]>([{label: 'Create new item', value: 'create'}]);
    const [selectedItem, setSelectedItem] = useState<SubstanceItem | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const { theme } = useContext(ThemeContext);
    const [isLoading, setIsLoading] = useState(true);

    const updateDropdown = async () => {
        const data = [{label: 'Create new item', value: 'create'}];
        const db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
        // create table if not exists
        await db.runAsync(`CREATE TABLE IF NOT EXISTS substance_items (
                            name TEXT PRIMARY KEY, 
                            amount INTEGER,
                            substance TEXT,
                            FOREIGN KEY(substance) REFERENCES trackers(name)
                        )`);
        const result = await db.getAllAsync('SELECT * FROM substance_items WHERE substance = ?', [substanceName]);
        for(const row of result as SubstanceItem[]){
            data.push({label: row.name, value: row.name+";"+row.amount});
        }
        setDropdownData(data);
    }
    useEffect(() => {
        updateDropdown();
        setIsLoading(false);
    }, []);

    return (
        <ThemedView style={[styles.container]}>
            {isLoading ? <ThemedText>Loading...</ThemedText>:(
                <View>
                    <ThemedText style={{ fontSize: 16, fontWeight: "500", marginBottom: 8, color: theme === "dark" ? Colors.dark.text : Colors.light.text }}>
                        Select or Create Item
                    </ThemedText>
                    <ThemedDropdown
                        data={dropdownData}
                        value={value}
                        style={[
                        styles.dropdown,
                        {
                            backgroundColor: theme === "dark" ? Colors.dark.inputBackground : Colors.light.inputBackground,
                            borderColor: theme === "dark" ? Colors.dark.inputBorder : Colors.light.inputBorder,
                        }
                        ]}
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
                                setSelectedItem({name: item.label, amount: parseInt(item.value.split(";")[1])});
                            }
                        }}
                    />
                </View>
            )}
            {showCreate && 
            <View style={styles.createView}>
                <ThemedText style={{ fontSize: 16, fontWeight: "500", marginBottom: 8, color: theme === "dark" ? Colors.dark.text : Colors.light.text }}>
                    Create New Item
                </ThemedText>
                <TextInput 
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme === "dark" ? Colors.dark.inputBackground : Colors.light.inputBackground,
                        color: theme === "dark" ? Colors.dark.text : Colors.light.text,
                        borderColor: theme === "dark" ? Colors.dark.inputBorder : Colors.light.inputBorder,
                      }
                    ]}
                    placeholderTextColor={theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary}
                />
                <TextInput 
                    placeholder="Amount (mg)"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme === "dark" ? Colors.dark.inputBackground : Colors.light.inputBackground,
                        color: theme === "dark" ? Colors.dark.text : Colors.light.text,
                        borderColor: theme === "dark" ? Colors.dark.inputBorder : Colors.light.inputBorder,
                      }
                    ]}
                    placeholderTextColor={theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary}
                />
                <TouchableOpacity 
                    style={[styles.saveButton, { backgroundColor: theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary }]}
                    activeOpacity={0.7}
                    onPress={async () => {
                        const db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
                        await db.runAsync('INSERT INTO substance_items (name, amount, substance) VALUES (?, ?, ?)', [name, parseInt(amount), substanceName]);
                        updateDropdown();
                        setShowCreate(false);
                        setAmount('');
                        setName('');
                        setValue(name + ";" + amount);
                        setSelectedItem({name, amount: parseInt(amount)});
                        setShowAdd(true);
                }}>
                    <ThemedText style={styles.saveButtonText}>Save Item</ThemedText>
                </TouchableOpacity>
            </View>
            }
            {showAdd &&
            <View style={styles.addView}>
                <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary }]}
                    activeOpacity={0.7}
                    onPress={ async () => {
                        if(selectedItem){
                            const db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
                            const tableName = getIntakesTableName(substanceName);
                            await db.runAsync(`INSERT INTO ${tableName} (name, amount) VALUES (?, ?)`, [selectedItem.name, selectedItem.amount]);
                            console.log("Added", selectedItem);
                            db.closeSync();
                            if (substanceName === "caffeine") {
                                router.navigate("/caffeine/logs")
                            } else {
                                router.navigate(`/customTrackers/substance/${substanceName}`);
                            }
                        }
                }}>
                    <ThemedText style={styles.saveButtonText}>Add Intake</ThemedText>
                </TouchableOpacity>
            </View>
            }

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    addButton: {
        alignItems: "center",
        backgroundColor: Colors.light.buttonPrimary,
        borderRadius: 12,
        marginTop: 16,
        paddingVertical: 14,
        paddingHorizontal: 24,
        width: "100%",
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
          },
          android: {
            elevation: 3,
          },
        }),
    },
    addView: {
        marginTop: 24
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        padding: 20
    },
    createView: {
        marginTop: 24
    },
    dropdown: {
        borderRadius: 8,
        borderWidth: 1,
        height: 52,
        paddingHorizontal: 12
    },
    input: {
        borderWidth: 1,
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    saveButton: {
        alignItems: "center",
        backgroundColor: Colors.light.buttonPrimary,
        borderRadius: 12,
        marginTop: 16,
        paddingVertical: 14,
        paddingHorizontal: 24,
        width: "100%",
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
          },
          android: {
            elevation: 3,
          },
        }),
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
});