import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Card } from "@/components/Card";
import { useCallback } from "react";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Href, useFocusEffect } from "expo-router";
import { router } from "expo-router";


export type Log = {
  time: string;
  urination: boolean;
  urinationColor: string;
  isPainUrination: boolean;
  isBM: boolean;
  BMColor: string;
  BMshape: string;
  isPainBM: boolean;
  isSmell: boolean;
  photo: string;
  notes:string;
}

const LogCard = ({log}: {log: Log}) => {
  const date = new Date(log.time).toDateString();

  return (
    <TouchableOpacity activeOpacity={1} onPress={()=>{
      const url:Href=`/toilet/details?time=${log.time}&urination=${log.urination}&urinationColor=${log.urinationColor?log.urinationColor.replace("#",""):null}&isPainUrination=${log.isPainUrination}&isBM=${log.isBM}&BMColor=${log.BMColor?log.BMColor.replace("#",""):null}&BMshape=${log.BMshape}&isPainBM=${log.isPainBM}&isSmell=${log.isSmell}&photo=${log.photo}&notes=${log.notes}`;
      console.log(url);
      router.navigate(url);
      }}>
    <Card style={{justifyContent:"space-between",alignItems:"flex-start"}}>
      <View style={{flex:1,flexDirection:"column",margin:5}}>
        <Text style={{fontWeight:"bold",fontSize:22}}>{date}</Text>
        <Text style={{fontSize:16}}>{log.time.split(" ")[1].substring(0,5)}</Text>
        <Text style={{marginTop:5}}>{log.notes}</Text>
      </View>
      <View style={{height:120}}>
        {
          log.urination?
          <View style={{flexDirection:"row-reverse",flex:1}}>
            <View style={{borderRadius:5,width:12,borderWidth:1,margin:4,backgroundColor:log.urinationColor}}></View>
            {log.isPainUrination?
            <Ionicons name="warning-outline" size={24} color="black" style={{alignSelf:"center", paddingHorizontal:6}}/>
            :null}
          </View>
          :<View style={{flex:1}}></View>
        }
        {
          log.isBM?
            <View style={{flexDirection:"row-reverse",flex:1}}>
              <View style={{borderRadius:5,width:12,borderWidth:1,margin:4,backgroundColor:log.BMColor}}></View>
              {log.isPainBM?
              <Ionicons name="warning-outline" size={24} color="black" style={{alignSelf:"center", paddingHorizontal:6}}/>
              :null}
              {log.isSmell?
              <Ionicons name="cloud" size={24} color="green" style={{alignSelf:"center", paddingHorizontal:6}}/>
              :null}
            </View>
            :<View style={{flex:1}}></View>
        }
      </View>
      
    </Card>
    </TouchableOpacity>
  );
};

export default function Logs() {
  const [logs, setLogs] = useState([] as Log[]);
  const fetchData = async () => {
    const db = await SQLite.openDatabaseAsync('MeTracker');
    await db.execAsync("CREATE TABLE IF NOT EXISTS toilet (time DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP, urination BOOLEAN, urinationColor TEXT, isPainUrination BOOLEAN, isBM BOOLEAN, BMColor TEXT, BMshape INTEGER, isPainBM BOOLEAN, isSmell BOOLEAN, photo TEXT, notes TEXT);");
    const allRows = await db.getAllAsync('SELECT * FROM toilet');
    setLogs(allRows as Log[]);
    console.log(allRows);
    db.closeSync();
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  console.log(logs);
  return (
    <View
      style={{
        flex: 1,
        padding:15,
        justifyContent: "flex-start",
        alignItems: "center"
      }}
    >
      {/* <TouchableOpacity onPress={()=>fetchData()}><Text>Refresh</Text></TouchableOpacity> */}
      {logs.length>0?
      <ScrollView
        showsHorizontalScrollIndicator={false}
    		style={{flex:1,display:"flex",width:"100%"}}
        >
        {logs.reverse().map((log, index) => (
          <LogCard key={index} log={log} />
        ))}

      </ScrollView>
      :<Text>No Logs</Text>}
    </View>
  );
}
