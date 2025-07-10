import React from 'react';
import { Alert, View } from 'react-native';
import { getLocales } from 'expo-localization';
import { Card } from './Card';
import { ThemedText } from './ThemedText';
import type { IntakeEntry } from '../types';
import * as SQLite from 'expo-sqlite/next';
import Toast from 'react-native-toast-message';


const locale = getLocales()[0].languageTag as string;
export default function SubstanceLogCard({log, substance, substanceUnit}: {log: IntakeEntry,substance: string, substanceUnit?: string}) {
    const time = new Date(log.time.replace("T", " ")+"Z");
    const dateString = time.toLocaleDateString(locale,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const timeString = time.toLocaleTimeString(locale,{ hour: '2-digit', minute: '2-digit' });
    const [deleted, setDeleted] = React.useState(false);
    return (!deleted &&
        <Card key={timeString}
        onSwipe={(direction) => {
            Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
            {text: "Cancel", style: "cancel"},
            {
                text: "Delete", style: "destructive",
                onPress: async () => {  
                const db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
                console.log("Deleting entry with ID:", log);
                await db.runAsync(`DELETE FROM ${substance}_intakes WHERE time = ?`, [log.time]);
                setDeleted(true);
                Toast.show({ type: "success", text1: "Entry deleted successfully" });
                await db.closeAsync();
                }
            }
            ]);
        }}>
            <View>
                <ThemedText>{dateString}</ThemedText>
                <ThemedText>{timeString}</ThemedText>
            </View>
            <ThemedText>{log.amount} {substanceUnit}</ThemedText>
        </Card>
    );
}

