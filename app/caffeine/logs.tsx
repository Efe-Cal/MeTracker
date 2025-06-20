import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SubstanceDecayGraph from '@/components/SubstanceDecayGraph';
import * as SQLite from 'expo-sqlite';
import { useCallback, useState } from 'react';
import type { IntakeEntry } from '@/types';
import { useFocusEffect } from 'expo-router';
import { Card } from '@/components/Card';
import { getLocales } from 'expo-localization';
import { router } from 'expo-router';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';

const locale = getLocales()[0].languageTag as string;
function LogCard({log}: {log: IntakeEntry}) {
    const time = new Date(log.time.replace("T", " ")+"Z");
    const dateString = time.toLocaleDateString(locale,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const timeString = time.toLocaleTimeString(locale,{ hour: '2-digit', minute: '2-digit' });
    return (
        <Card key={timeString} style={styles.card}>
            <View>
                <Text>{dateString}</Text>
                <Text>{timeString}</Text>
            </View>
            <Text>{log.amount} mg</Text> 
        </Card>
    );
}


export default function Caffeine(){
    const [intakes, setIntakes] = useState([] as IntakeEntry[]);
    
    useFocusEffect(    
        useCallback(() => {
            const fetchIntakes = async () => {
                const db = await SQLite.openDatabaseAsync('MeTracker');
                await db.runAsync('CREATE TABLE IF NOT EXISTS caffeine_intakes (time DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP, name TEXT, amount INTEGER)');
                const result = await db.getAllAsync('SELECT * FROM caffeine_intakes');
                setIntakes(result as IntakeEntry[]);  
            }
            
            fetchIntakes();
        }, [])
    );
    
    
    return (
        <View style={styles.container}>
            <SubstanceDecayGraph intakes={intakes} halflife={4} />
            <Text>Intakes: </Text>
            {intakes.map((intake) => {
                return (
                    <LogCard key={intake.time} log={intake} />
                );
            })}
            {/* Floating Plus Button */}
            <FloatingPlusButton onPress={() => router.navigate('/caffeine/add')} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        // Add card-specific styles here if needed
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        padding: 20
    }
});
