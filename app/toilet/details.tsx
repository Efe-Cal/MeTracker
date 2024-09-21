import { useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, Image, ToastAndroid, Alert } from 'react-native';
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
        const db = await SQLite.openDatabaseAsync("MeTracker");
        await db.runAsync(`DELETE FROM toilet WHERE time=?`,[log.time]);
        ToastAndroid.show("Log Deleted",ToastAndroid.SHORT);
        db.closeSync();
        router.back();
    }
    console.log(log);
    const date = new Date(log.time).toDateString();
    return (
        <View>
            <View style={{ 
                marginHorizontal:10,
                flexDirection: 'row', 
                alignItems: 'center', 
                padding: 10, 
                borderBottomWidth: 1, 
                borderBottomColor: '#ddd',
                
            }}>
                <TouchableOpacity onPress={()=>{
                    router.back();
                }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ 
                    fontSize: 20, 
                    marginLeft: 10, 
                    fontWeight: 'bold',
                    color: '#333'
                }}>
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
            <View style={{marginTop:-10,padding:20}}>
                <View style={{borderBottomWidth:1}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>Urination</Text>
                </View>
                <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between",paddingHorizontal:10,alignContent:"center"}}>
                    <Text style={{fontSize:20}}>Color</Text>
                    <View style={{borderRadius:5,width:25,height:25,borderWidth:1,margin:4,backgroundColor:"#"+log.urinationColor}}></View>
                </View>
                <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between",paddingHorizontal:10,alignContent:"center"}}>
                    <Text style={{fontSize:20}}>Pain</Text>
                    <Text style={{fontSize:20}}>{log.isPainUrination=="1"?"Yes":"No"}</Text>
                </View>
            </View>
            :null}
            {/* BM */}
            {log.isBM=="1"?
            <View style={{marginTop:-10,padding:20}}>
                <View style={{borderBottomWidth:1}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>Bowel Movement</Text>
                </View>
                <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between",paddingHorizontal:10,alignContent:"center"}}>
                    <Text style={{fontSize:20}}>Color</Text>
                    <View style={{borderRadius:5,width:25,height:25,borderWidth:1,margin:4,backgroundColor:"#"+log.BMColor}}></View>
                </View>
                <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between",paddingHorizontal:10,alignContent:"center"}}>
                    <Text style={{fontSize:20}}>Pain</Text>
                    <Text style={{fontSize:20}}>{log.isPainBM=="1"?"Yes":"No"}</Text>
                </View>
                <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between",paddingHorizontal:10,alignContent:"center"}}>
                    <Text style={{fontSize:20}}>Foul-Smell</Text>
                    <Text style={{fontSize:20}}>{log.isSmell=="1"?"Yes":"No"}</Text>
                </View>
            </View>
            :null}

            {/* Notes */}
            {log.notes.length>0?
            <View style={{marginTop:-10,padding:20}}>
                <View style={{borderBottomWidth:1}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>Notes</Text>
                </View>
                <View style={{marginTop:10,paddingHorizontal:10}}>
                    <Text style={{fontSize:20}}>{log.notes}</Text>
                </View>
            </View>
            :null}

            {/* Photo */}
            {log.photo.length>0?
            <View style={{marginTop:-10,padding:20}}>
                <View style={{borderBottomWidth:1}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>Photo</Text>
                </View>
                <View style={{marginTop:10,paddingHorizontal:10}}>
                    <Image source={{uri:log.photo}} style={{width:300,height:300}}/>
                </View>
            </View>
            :null}
        </View>
    );
}