import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "@/components/Card";
import { useCallback } from "react";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Href, useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { FloatingPlusButton } from '@/components/FloatingPlusButton';


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
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardDate}>{date}</Text>
        <Text style={styles.cardTime}>{log.time.split(" ")[1].substring(0,5)}</Text>
        <Text style={styles.cardNotes}>{log.notes}</Text>
      </View>
      <View style={styles.logView}>
        {
          log.urination?
          <View style={styles.iconRow}>
            <View style={[styles.colorBox, {backgroundColor:log.urinationColor}]}></View>
            {log.isPainUrination?
            <Ionicons name="warning-outline" size={24} color="black" style={styles.icon}/>
            :null}
          </View>
          :<View style={styles.iconRowEmpty}></View>
        }
        {
          log.isBM?
            <View style={styles.iconRow}>
              <View style={[styles.colorBox, {backgroundColor:log.BMColor}]}></View>
              {log.isPainBM?
              <Ionicons name="warning-outline" size={24} color="black" style={styles.icon}/>
              :null}
              {log.isSmell?
              <Ionicons name="cloud" size={24} color="green" style={styles.icon}/>
              :null}
            </View>
            :<View style={styles.iconRowEmpty}></View>
        }
      </View>
      
    </Card>
    </TouchableOpacity>
  );
};

export default function Logs() {
  const [logs, setLogs] = useState([] as Log[]);
  const fetchData = async () => {
    const db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
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
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={()=>fetchData()}><Text>Refresh</Text></TouchableOpacity> */}
      {logs.length>0?
      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        >
        {logs.reverse().map((log, index) => (
          <LogCard key={index} log={log} />
        ))}
      </ScrollView>
      :<Text>No Logs</Text>}
      {/* Floating Plus Button */}
      <FloatingPlusButton onPress={() => router.navigate('/toilet/add')} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  cardContent: {
    flex: 1,
    flexDirection: "column",
    margin: 5
  },
  cardDate: {
    fontSize: 22,
    fontWeight: "bold"
  },
  cardNotes: {
    marginTop: 5
  },
  cardTime: {
    fontSize: 16
  },
  colorBox: {
    borderRadius: 5,
    borderWidth: 1,
    margin: 4,
    width: 12
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    padding: 15
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#4630EB',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10
  },
  icon: {
    alignSelf: "center",
    paddingHorizontal: 6
  },
  iconRow: {
    flex: 1,
    flexDirection: "row-reverse"
  },
  iconRowEmpty: {
    flex: 1
  },
  logView: {
    height: 120
  },
  scrollView: {
    display: "flex",
    flex: 1,
    width: "100%"
  }
});