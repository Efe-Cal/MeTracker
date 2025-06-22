import { useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, Image, ToastAndroid, Alert, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import * as SQLite from 'expo-sqlite';

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
    const deleteLog = async ()=>{
        const db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
        await db.runAsync(`DELETE FROM toilet WHERE time=?`,[log.time]);
        ToastAndroid.show("Log Deleted",ToastAndroid.SHORT);
        db.closeSync();
        router.back();
    }
    console.log(log);
    const date = new Date(log.time).toDateString();
    return (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>{
                    router.back();
                }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {date}
                </Text>
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
                    <Feather name="trash-2" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {/* Urination */}
            {log.urination=="1"?
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>Urination</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Color</Text>
                    <View style={[styles.colorBox, {backgroundColor:"#"+log.urinationColor}]}></View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Pain</Text>
                    <Text style={styles.rowLabel}>{log.isPainUrination=="1"?"Yes":"No"}</Text>
                </View>
            </View>
            :null}
            {/* BM */}
            {log.isBM=="1"?
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>Bowel Movement</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Color</Text>
                    <View style={[styles.colorBox, {backgroundColor:"#"+log.BMColor}]}></View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Pain</Text>
                    <Text style={styles.rowLabel}>{log.isPainBM=="1"?"Yes":"No"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Foul-Smell</Text>
                    <Text style={styles.rowLabel}>{log.isSmell=="1"?"Yes":"No"}</Text>
                </View>
            </View>
            :null}

            {/* Notes */}
            {log.notes.length>0?
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>Notes</Text>
                </View>
                <View style={styles.notesView}>
                    <Text style={styles.notesText}>{log.notes}</Text>
                </View>
            </View>
            :null}

            {/* Photo */}
            {log.photo.length>0?
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>Photo</Text>
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
        color: '#333',
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
        marginTop: -10,
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