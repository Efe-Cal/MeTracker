import { useLocalSearchParams } from 'expo-router';
import { View, TouchableOpacity, Image, ToastAndroid, Alert, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';
import { ThemedText } from '@/components/ThemedText';

export default function Details(){
    const log = useLocalSearchParams<{
        time: string;
        urination: string;
        urinationColor: string;
        isPainUrination: string;
        isBM: string;
        BMColor: string;
        BMshape: string;
        isPainBM: string;
        isSmell: string;
        photo: string;
        notes:string;
    }>();
    const { theme } = useContext(ThemeContext);
    const deleteLog = async ()=>{
        const db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
        await db.runAsync(`DELETE FROM toilet WHERE time=?`,[log.time]);
        ToastAndroid.show("Log Deleted",ToastAndroid.SHORT);
        db.closeSync();
        router.back();
    }
    const date = new Date(log.time).toDateString();
    return (
        <View style={{ flex: 1, backgroundColor: theme === "dark" ? "#18181b" : "#fff" }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>{
                    router.back();
                }}>
                    <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "black"} />
                </TouchableOpacity>
                <ThemedText style={[styles.headerTitle, {color: theme === "dark" ? "#fff" : "#000"}]}>
                    {date}
                </ThemedText>
                <View style={{flex:1}}></View>
                <TouchableOpacity onPress={()=>{
                    Alert.alert(
                        "Delete Log",
                        "Are you sure you want to delete this log?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Delete",
                                onPress: deleteLog
                            }
                        ]
                    );}}>
                    <Feather name="trash-2" size={24} color={theme === "dark" ? "#fff" : "black"} />
                </TouchableOpacity>
            </View>
            {/* Urination */}
            {log.urination=="1"?
            <View style={styles.section}>
                <View style={[styles.sectionHeader, {borderBottomColor: theme === "dark" ? "#fff" : "#000"}]}>
                    <ThemedText style={styles.sectionHeaderText}>Urination</ThemedText>
                </View>
                <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Color</ThemedText>
                    <View style={[styles.colorBox, {backgroundColor:"#"+log.urinationColor}]}></View>
                </View>
                <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Pain</ThemedText>
                    <ThemedText style={styles.rowLabel}>{log.isPainUrination=="1"?"Yes":"No"}</ThemedText>
                </View>
            </View>
            :null}
            {/* BM */}
            {log.isBM=="1"?
            <View style={styles.section}>
                <View style={[styles.sectionHeader, {borderBottomColor: theme === "dark" ? "#fff" : "#000"}]}>
                    <ThemedText style={styles.sectionHeaderText}>Bowel Movement</ThemedText>
                </View>
                <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Color</ThemedText>
                    <View style={[styles.colorBox, {backgroundColor:"#"+log.BMColor}]}></View>
                </View>
                <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Pain</ThemedText>
                    <ThemedText style={styles.rowLabel}>{log.isPainBM=="1"?"Yes":"No"}</ThemedText>
                </View>
                <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Foul-Smell</ThemedText>
                    <ThemedText style={styles.rowLabel}>{log.isSmell=="1"?"Yes":"No"}</ThemedText>
                </View>
            </View>
            :null}

            {/* Notes */}
            {log.notes.length>0?
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionHeaderText}>Notes</ThemedText>
                </View>
                <View style={styles.notesView}>
                    <ThemedText style={styles.notesText}>{log.notes}</ThemedText>
                </View>
            </View>
            :null}

            {/* Photo */}
            {log.photo.length>0?
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionHeaderText}>Photo</ThemedText>
                </View>
                <View style={styles.photoView}>
                    <Image source={{uri:log.photo}} style={styles.photo} />
                </View>
            </View>
            :null}
        </View>
    );
}

const styles = StyleSheet.create({
    colorBox: {
        borderRadius: 5,
        borderWidth: 1,
        height: 25,
        margin: 4,
        width: 25
    },
    header: {
        alignItems: 'center',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        padding: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10
    },
    notesText: {
        fontSize: 20
    },
    notesView: {
        marginTop: 10,
        paddingHorizontal: 10
    },
    photo: {
        height: 300,
        width: 300
    },
    photoView: {
        marginTop: 10,
        paddingHorizontal: 10
    },
    row: {
        alignContent: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 10
    },
    rowLabel: {
        fontSize: 20
    },
    section: {
        padding: 20
    },
    sectionHeader: {
        borderBottomWidth: 1
    },
    sectionHeaderText: {
        fontSize: 24,
        fontWeight: 'bold'
    }
});