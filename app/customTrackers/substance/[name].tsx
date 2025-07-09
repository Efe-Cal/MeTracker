import { View, StyleSheet } from 'react-native';
import SubstanceDecayGraph from '@/components/SubstanceDecayGraph';
import { useContext, useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';
import { useIntakes } from '@/hooks/useIntakes';
import SubstanceLogCard from '@/components/SubstanceLogCard';
import * as SQLite from 'expo-sqlite/next';
import { ThemedView } from '@/components/ThemedView';

export default function CustomSubstanceTracker(){
    const { name } = useLocalSearchParams<{ name: string }>();
    const intakes = useIntakes(name);
    const { theme } = useContext(ThemeContext);
    const [substanceUnit, setSubstanceUnit] = useState<string | undefined>();
    useEffect(() => {
        const getSubstanceUnit = async () => {
            let db: SQLite.SQLiteDatabase | null = null;
            try {
                db = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
                const result = await db.getFirstAsync('SELECT substanceData FROM trackers WHERE name = ?', [name]) as {substanceData?: string} | undefined;
                if (result && result.substanceData) {
                    const substanceData = JSON.parse(result.substanceData) as { substanceUnit?: string };
                    setSubstanceUnit(substanceData.substanceUnit || "mg");
                } else {
                    setSubstanceUnit(""); // default
                }
            } catch (error) {
                console.error("Error fetching substance unit:", error);
                setSubstanceUnit("mg"); // default on error
            } finally {
                await db?.closeAsync();
            }
        };
        if (name) {
            getSubstanceUnit();
        }
    }, [name]);
        
    return (
        <ThemedView style={[styles.container]}>
            <SubstanceDecayGraph intakes={intakes} halflife={4} theme={theme} substanceName={name}/>
            
            <ThemedText style={{marginTop:10}}>Intakes: </ThemedText>
            {intakes.reverse().slice(0,11).map((intake) => {
                return (
                    <SubstanceLogCard key={intake.time} log={intake} substance={name} substanceUnit={substanceUnit} />
                );
            })}

            <FloatingPlusButton onPress={() => router.navigate({pathname:'/customTrackers/substance/add', params: { name }})} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        padding: 20
    }
});
