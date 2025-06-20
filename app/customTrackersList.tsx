import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';
import { router } from 'expo-router';

export default function CustomTrackersList() {
    const [customTrackers, setCustomTrackers] = useState<{ name: string }[]>([]);
    
    useEffect(() => {
        let isMounted = true;
        (async () => {
        const db = await SQLite.openDatabaseAsync("Trackers.db");
        const rows = await db.getAllAsync<{ name: string }>(`SELECT name FROM trackers`);
        console.log("Custom Trackers:", rows);
        if (isMounted) setCustomTrackers(rows || []);
        })();
        return () => { isMounted = false; };
    }, []);
    
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.list}>
                {customTrackers.map((tracker, index) => (
                    <Link key={index} href={`/customTrackers/${tracker.name}`} style={styles.card}>
                        <Text style={styles.cardText}>{tracker.name}</Text>
                    </Link>
                ))}
            </ScrollView>
            {/* Floating Plus Button */}
            <FloatingPlusButton onPress={() => router.navigate('/createTracker/createMenu')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16, // Changed from margin to padding
        justifyContent: "flex-start",
        flexDirection: 'column',
        position: "relative",
        backgroundColor: "#f8f9fa",
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardText: {
        fontSize: 18,
        color: "#222",
    },
});