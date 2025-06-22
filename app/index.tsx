import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import * as SQLite from 'expo-sqlite';

export default function Index() {
  const [customTrackers, setCustomTrackers] = useState<{ name: string }[]>([]);

  useFocusEffect(
    // useCallback ensures stable reference
    useCallback(() => {
      let isActive = true;
      (async () => {
        try {
          const db = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
          await db.execAsync(`CREATE TABLE IF NOT EXISTS trackers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);`);
          const rows = await db.getAllAsync<{ name: string }>(`SELECT name FROM trackers`);
          if (isActive) setCustomTrackers(rows || []);
        } catch (e) {
          if (isActive) setCustomTrackers([]);
        }

      })();
      return () => { isActive = false; };
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome to the MeTracker.</Text>
      <Text style={styles.subheader}>This app lets you keep track of your health.</Text>
      <Text style={styles.sectionTitle}>Prebuilt Trackers</Text>
      <Link href="/caffeine/logs" asChild>
        <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Caffeine Tracker</Text></TouchableOpacity>
      </Link>
      <Link href="/toilet/logs" asChild>
        <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Toilet Logs</Text></TouchableOpacity>
      </Link>
      <Text style={styles.sectionTitle}>Custom Trackers</Text>
      {customTrackers.length === 0 && (
        <Text style={styles.emptyText}>No custom trackers yet.</Text>
      )}
      {customTrackers.map((tracker, idx) => (
        <Link key={tracker.name + idx} href={`/customTrackers/${tracker.name}`} asChild>
          <TouchableOpacity style={styles.card}><Text style={styles.cardText}>{tracker.name}</Text></TouchableOpacity>
        </Link>
      ))}
      <Link href="/createTracker/createMenu" asChild>
        <TouchableOpacity style={[styles.card, styles.createButton]}>
          <Text style={[styles.cardText, { color: "#4630EB" }]}>+ Create New Tracker</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8f9fa"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center"
  },
  subheader: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
    alignSelf: "flex-start"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    color: "#222",
    textAlign: "left"
  },
  createButton: {
    borderColor: "#4630EB",
    borderWidth: 2,
    backgroundColor: "#f3f2fd"
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    marginBottom: 8
  }
});