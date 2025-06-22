import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import * as SQLite from 'expo-sqlite';
import { ThemeContext } from "@/theme/ThemeContext";
import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {
  const [customTrackers, setCustomTrackers] = useState<{ name: string }[]>([]);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useFocusEffect(
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
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme === "dark" ? "#18181b" : "#f8f9fa" }]}>
      <ThemedText style={[styles.header, { color: theme === "dark" ? "#fff" : "#222" }]}>Welcome to the MeTracker.</ThemedText>
      <ThemedText style={[styles.subheader, { color: theme === "dark" ? "#ccc" : "#222" }]}>This app lets you keep track of your health.</ThemedText>
      <ThemedText style={[styles.sectionTitle, { color: theme === "dark" ? "#fff" : "#222" }]}>Prebuilt Trackers</ThemedText>
      <Link href="/caffeine/logs" asChild>
        <TouchableOpacity style={{ width: "100%" }}>
          <Card style={styles.fullWidthCard}>
            <ThemedText style={[styles.cardText, theme === "dark" && { color: "#fff" }]}>Caffeine Tracker</ThemedText>
          </Card>
        </TouchableOpacity>
      </Link>
      <Link href="/toilet/logs" asChild>
        <TouchableOpacity style={{ width: "100%" }}>
          <Card style={styles.fullWidthCard}>
            <ThemedText style={[styles.cardText, theme === "dark" && { color: "#fff" }]}>Toilet Logs</ThemedText>
          </Card>
        </TouchableOpacity>
      </Link>
      <ThemedText style={[styles.sectionTitle, { color: theme === "dark" ? "#fff" : "#222" }]}>Custom Trackers</ThemedText>
      {customTrackers.length === 0 && (
        <ThemedText style={[styles.emptyText, { color: theme === "dark" ? "#888" : "#888" }]}>No custom trackers yet.</ThemedText>
      )}
      {customTrackers.map((tracker, idx) => (
        <Link key={tracker.name + idx} href={`/customTrackers/${tracker.name}`} asChild>
          <TouchableOpacity style={{ width: "100%" }}>
            <Card style={styles.fullWidthCard}>
              <ThemedText style={[styles.cardText, theme === "dark" && { color: "#fff" }]}>{tracker.name}</ThemedText>
            </Card>
          </TouchableOpacity>
        </Link>
      ))}
      <Link href="/createTracker/createMenu" asChild>
        <TouchableOpacity>
          <Card style={[styles.createButton, styles.fullWidthCard]}>
            <ThemedText style={[styles.cardText, { color: "#4630EB" }]}>+ Create New Tracker</ThemedText>
          </Card>
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
  },
  fullWidthCard: {
    width: "100%",
  },
});