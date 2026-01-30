import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as SQLite from 'expo-sqlite/next';
import { ThemeContext } from '@/theme/ThemeContext';
import ThemedDropdown from './ThemedDropdown';
import { Colors } from '@/constants/Colors';

type SelectFieldProps = {
    label: string;
    trackerID: number;
    fieldName: string;
    onChange: (value: string) => void;
};

const SelectField: React.FC<SelectFieldProps> = ({ label, trackerID, fieldName, onChange }) => {
    const [data, setData] = React.useState<{ label: string, value: string }[]>([]);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchData = async () => {
            const db = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
            const options = await db.getAllAsync(
                `SELECT option FROM tracker_${trackerID}_select_options WHERE fieldId = (SELECT id FROM fields WHERE trackerId = ? AND name = ?)`,
                [trackerID, fieldName]
            ) as { option: string }[];
            setData(options.map(option => ({
                value: option.option,
                label: option.option,
            })));
        };

        fetchData().catch(error => {
            console.error("Error fetching select options:", error);
        });
    }, [trackerID, fieldName]);

    return (
        <View style={styles.container}>
            {label && <Text style={[
                styles.label,
                { color: theme === "dark" ? Colors.dark.text : Colors.light.text }
            ]}>{label}</Text>}
            <ThemedDropdown
                style={[
                    styles.dropdown,
                    {
                        backgroundColor: theme === "dark" ? Colors.dark.inputBackground : Colors.light.inputBackground,
                        borderColor: theme === "dark" ? Colors.dark.inputBorder : Colors.light.inputBorder,
                    }
                ]}
                data={data}
                labelField="label"
                valueField="value"
                value={""}
                onChange={(item) => {
                    if (item) {
                        onChange(item.value);
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: "500",
    },
    dropdown: {
        height: 52,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
});

export default SelectField;