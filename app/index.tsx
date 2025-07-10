import { Button, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Href, Link, useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import * as SQLite from 'expo-sqlite';
import { ThemeContext } from "@/theme/ThemeContext";
import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {
  const [customTrackers, setCustomTrackers] = useState<{ name: string, isSubstanceTracker?:boolean }[]>([]);
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        try {
          const db = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS trackers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    isSubstanceTracker BOOLEAN DEFAULT 0,
                    substanceData TEXT DEFAULT NULL
                );`);
          const rows = await db.getAllAsync<{ name: string; isSubstanceTracker?: number }>(`SELECT name, isSubstanceTracker FROM trackers`);
          if (isActive) setCustomTrackers(
            (rows || []).map(row => ({
              name: row.name,
              isSubstanceTracker: !!row.isSubstanceTracker
            }))
          );
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
      {(customTrackers.length === 0 || (customTrackers.length===1 && customTrackers[0].name==="caffeine")) && (
        <ThemedText style={[styles.emptyText, { color: theme === "dark" ? "#888" : "#888" }]}>No custom trackers yet.</ThemedText>
      )}
      {customTrackers.map((tracker, idx) => {
        const href = (tracker.isSubstanceTracker
          ? `/customTrackers/substance/${tracker.name}`
          : `/customTrackers/${tracker.name}`) as Href;
        if (tracker.name === "caffeine" ) return null; // Skip the caffeine tracker as it's already listed above
        return (
          <Link key={tracker.name + idx} href={href} asChild>
            <TouchableOpacity style={{ width: "100%" }}>
              <Card style={styles.fullWidthCard}>
                <ThemedText style={[styles.cardText, theme === "dark" && { color: "#fff" }]}>{tracker.name}</ThemedText>
              </Card>
            </TouchableOpacity>
          </Link>
        );
      })}
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