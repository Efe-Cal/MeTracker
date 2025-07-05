import { ScrollView, View, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from "react-native";
import { Card } from "@/components/Card";
import { useCallback, useContext } from "react";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Href, useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { FloatingPlusButton } from '@/components/FloatingPlusButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';


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
  const { theme } = useContext(ThemeContext); // Add theme context

  return (
    <TouchableOpacity activeOpacity={1} onPress={()=>{
      const url:Href=`/toilet/details?time=${log.time}&urination=${log.urination}&urinationColor=${log.urinationColor?log.urinationColor.replace("#",""):null}&isPainUrination=${log.isPainUrination}&isBM=${log.isBM}&BMColor=${log.BMColor?log.BMColor.replace("#",""):null}&BMshape=${log.BMshape}&isPainBM=${log.isPainBM}&isSmell=${log.isSmell}&photo=${log.photo}&notes=${log.notes}`;
      router.navigate(url);
      }}>
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardDate}>{date}</ThemedText>
        <ThemedText style={styles.cardTime}>{log.time.split(" ")[1].substring(0,5)}</ThemedText>
        <ThemedText style={styles.cardNotes}>{log.notes}</ThemedText>
      </View>
      <View style={styles.logView}>
        {
          log.urination?
          <View style={styles.iconRow}>
            <View style={[styles.colorBox, {backgroundColor:log.urinationColor}]}></View>
            {log.isPainUrination?
            <Ionicons name="warning-outline" size={24} color={theme === "dark" ? "white" : "black"} style={styles.icon}/>
            :null}
          </View>
          :<View style={styles.iconRowEmpty}></View>
        }
        {
          log.isBM?
            <View style={styles.iconRow}>
              <View style={[styles.colorBox, {backgroundColor:log.BMColor}]}></View>
              {log.isPainBM?
              <Ionicons name="warning-outline" size={24} color={theme === "dark" ? "white" : "black"} style={styles.icon}/>
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
  const { theme } = useContext(ThemeContext);
  const fetchData = async () => {
    let db: SQLite.SQLiteDatabase | null = null;
    try {
      db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
      await db.execAsync("CREATE TABLE IF NOT EXISTS toilet (time DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP, urination BOOLEAN, urinationColor TEXT, isPainUrination BOOLEAN, isBM BOOLEAN, BMColor TEXT, BMshape INTEGER, isPainBM BOOLEAN, isSmell BOOLEAN, photo TEXT, notes TEXT);");
      const allRows = await db.getAllAsync('SELECT * FROM toilet');
      setLogs(allRows as Log[]);
    } catch (error) {
      console.error("Failed to fetch toilet logs:", error);
    } finally {
      db?.closeSync();
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#18181b" : "#f8f9fa" }]}>
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
      :<ThemedText>No Logs</ThemedText>}
      
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