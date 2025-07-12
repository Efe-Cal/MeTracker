import React from 'react';
import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Card } from '@/components/Card';
import * as SQLite from 'expo-sqlite';
import { ThemedText } from './ThemedText';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useContext } from 'react'



export default function CustomTrackerLogCard({ index, data, trackerID, fields, setTrackerData }: { index: number, data: any, trackerID: string, fields: any[], setTrackerData: React.Dispatch<React.SetStateAction<any[]>> }) {
    const { theme } = useContext(ThemeContext);
    return (
        <Card
            key={index}
            style={{ marginBottom: 16, padding: 16, width: '100%', flexDirection: 'column', alignSelf: "center" }}
            onSwipe={(direction) => {
                Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete", style: "destructive",
                        onPress: async () => {
                            let db: SQLite.SQLiteDatabase | null = null;
                            try {
                                db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
                                console.log("Deleting entry with ID:", data);
                                await db.runAsync(`DELETE FROM tracker_${trackerID} WHERE created_at = ?`, [data.created_at]);
                                setTrackerData((prevData) => prevData.filter((item) => item.created_at !== data.created_at));
                                Toast.show({ type: "success", text1: "Entry deleted successfully" });
                            } catch (error) {
                                console.error("Error deleting entry:", error);
                                Toast.show({ type: "error", text1: "Failed to delete entry" });
                            } finally {
                                await db?.closeAsync();
                            }
                        }
                    }
                ]);
            }}
        >
            {/* // show created_at */}
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#222", paddingBottom: 8 }}>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {data.created_at
                        ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                        " " +
                        new Date(data.created_at).toLocaleDateString()
                        : "No date available"}
                </ThemedText>
            </View>
            {/* Render data content here if needed */}
            {fields.map((field) => (
                <View key={field.id} style={styles.fieldContainer}>
                    <ThemedText style={{ fontWeight: 'bold' }}>{field.name}:</ThemedText>
                    {field.type === "image" ?
                        <TouchableOpacity onPress={() => {
                            if (data[field.name]) {
                                router.push({
                                    pathname: '/imageViewer',
                                    params: { uri: data[field.name] }
                                });
                            }
                        }}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end", flex: 1, paddingRight: 10 }}>
                            <FontAwesome name="image" size={24} color={theme === "dark" ? "#fff" : "#000"} />
                        </TouchableOpacity> : null}
                    <ThemedText style={{ maxWidth: "70%" }}>
                        {field.type === "boolean"
                            ? (data[field.name]
                                ? <FontAwesome name="check-square" size={24} color="green" />
                                : <FontAwesome name="close" size={24} color="red" />)
                            : (field.type !== "image" ? data[field.name] : null)
                        }
                    </ThemedText>
                </View>
            ))}
        </Card>
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        width: "100%",
        padding: 16,
        flex: 1
    },
    fieldContainer: {
        width: "100%",
        padding: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    }
});