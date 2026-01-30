import { StyleSheet, ScrollView } from 'react-native';
import SubstanceDecayGraph from '@/components/SubstanceDecayGraph';
import { useContext } from 'react';
import { router } from 'expo-router';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';
import { useIntakes } from '@/hooks/useIntakes';
import SubstanceLogCard from '@/components/SubstanceLogCard';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';


export default function Caffeine(){
    const intakes = useIntakes('caffeine');
    const { theme } = useContext(ThemeContext);
    
    useEffect(() => {
        let db: SQLite.SQLiteDatabase | null = null;
        async function setupDatabase() {
            try {
                db = await SQLite.openDatabaseAsync('customTrackers.db');
                const exists = await db.getFirstAsync(
                    `SELECT 1 FROM trackers WHERE name = ? LIMIT 1`,
                    ['caffeine']
                );
                if (!exists) {
                    await db.runAsync(`
                        INSERT INTO trackers (name, isSubstanceTracker, substanceData)
                        VALUES ('caffeine', 1, '{"substanceHalfLife": 4, "substanceUnit": "mg", "maxY": 250}')
                    `);
                }
            } catch (error) {
                console.error("Error setting up caffeine tracker in DB:", error);
            } finally {
                await db?.closeAsync();
            }
        }
        setupDatabase();
    }, []);

    return (
        <ThemedView style={[styles.container]}>
            <SubstanceDecayGraph intakes={intakes} halflife={4} theme={theme} substanceName='caffeine'/>
            <ThemedText style={[styles.sectionTitle, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>Recent Intakes</ThemedText>
            <ScrollView 
                style={styles.listContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {intakes.reverse().slice(0,11).map((intake) => {
                    return (
                        <SubstanceLogCard key={intake.time} log={intake} substance='caffeine' substanceUnit='mg'/>
                    );
                })}
            </ScrollView>
            <FloatingPlusButton onPress={() => router.navigate('/caffeine/add')} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 16,
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 80,
    },
});
