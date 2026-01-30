import { ScrollView, StyleSheet, TouchableOpacity, View, Pressable } from "react-native";
import { Href, Link, router, useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import * as SQLite from 'expo-sqlite';
import { ThemeContext } from "@/theme/ThemeContext";
import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import SignIn from "@/components/SignIn";
import { Feather } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";

export default function Index() {
  const [ customTrackers, setCustomTrackers ] = useState<{ name: string, isSubstanceTracker?:boolean }[]>([]);
  const { theme } = useContext(ThemeContext);
  const [ passedAuth, setPassedAuth ] = useState(false);

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
    (passedAuth ? (
      <>
        {/* Custom Header */}
        <View style={{
          width: "100%",
          paddingTop: 48,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: theme === "dark" ? Colors.dark.background : Colors.light.background,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: theme === "dark" ? Colors.dark.cardBorder : Colors.light.cardBorder,
        }}>
          <ThemedText style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme === "dark" ? Colors.dark.text : Colors.light.text,
            flex: 1,
          }}>
            MeTracker
          </ThemedText>
          {/* headerRight */}
          <Pressable
            onPress={() => router.push("/settings")}
            style={{
              padding: 10,
              borderRadius: 12,
              backgroundColor: theme === "dark" ? Colors.dark.cardBackground : Colors.light.cardBackground,
              borderWidth: 1,
              borderColor: theme === "dark" ? Colors.dark.cardBorder : Colors.light.cardBorder,
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather
              name="settings"
              size={20}
              color={theme === "dark" ? Colors.dark.icon : Colors.light.icon}
            />
          </Pressable>
        </View>
        {/* Main Content */}
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme === "dark" ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary }]}>
          <View style={styles.welcomeSection}>
            <ThemedText style={[styles.header, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>Welcome Back!</ThemedText>
            <ThemedText style={[styles.subheader, { color: theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Track your health and habits</ThemedText>
          </View>
          <ThemedText style={[styles.sectionTitle, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>Prebuilt Trackers</ThemedText>
          <Link href="/caffeine/logs" asChild>
            <TouchableOpacity style={{ width: "100%" }} activeOpacity={0.7}>
              <Card style={styles.fullWidthCard}>
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#3b2f99' : '#e0d9ff' }]}>
                    <Feather name="coffee" size={22} color={theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary} />
                  </View>
                  <ThemedText style={[styles.cardText, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>Caffeine Tracker</ThemedText>
                </View>
                <Feather name="chevron-right" size={20} color={theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary} />
              </Card>
            </TouchableOpacity>
          </Link>
          <Link href="/toilet/logs" asChild>
            <TouchableOpacity style={{ width: "100%" }} activeOpacity={0.7}>
              <Card style={styles.fullWidthCard}>
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#1e5a5a' : '#d1f5f5' }]}>
                    <Feather name="activity" size={22} color={theme === "dark" ? '#34d399' : '#10b981'} />
                  </View>
                  <ThemedText style={[styles.cardText, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>Toilet Logs</ThemedText>
                </View>
                <Feather name="chevron-right" size={20} color={theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary} />
              </Card>
            </TouchableOpacity>
          </Link>
          <ThemedText style={[styles.sectionTitle, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>Custom Trackers</ThemedText>
          {(customTrackers.length === 0 || (customTrackers.length===1 && customTrackers[0].name==="caffeine")) && (
            <View style={styles.emptyStateContainer}>
              <Feather name="inbox" size={48} color={theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary} />
              <ThemedText style={[styles.emptyText, { color: theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>No custom trackers yet</ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Create one to get started!</ThemedText>
            </View>
          )}
          {customTrackers.map((tracker, idx) => {
            const href = (tracker.isSubstanceTracker
              ? `/customTrackers/substance/${tracker.name}`
              : `/customTrackers/${tracker.name}`) as Href;
            if (tracker.name === "caffeine" ) return null; // Skip the caffeine tracker as it's already listed above
            return (
              <Link key={tracker.name + idx} href={href} asChild>
                <TouchableOpacity style={{ width: "100%" }} activeOpacity={0.7}>
                  <Card style={styles.fullWidthCard}>
                    <View style={styles.cardContent}>
                      <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#4d3319' : '#ffecd1' }]}>
                        <Feather name="target" size={22} color={theme === "dark" ? '#fbbf24' : '#f59e0b'} />
                      </View>
                      <ThemedText style={[styles.cardText, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>{tracker.name}</ThemedText>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary} />
                  </Card>
                </TouchableOpacity>
              </Link>
            );
          })}
          <Link href="/createTracker/createMenu" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Card style={[styles.createButton, styles.fullWidthCard]}>
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#3b2f99' : '#e0d9ff' }]}>
                    <Feather name="plus" size={22} color={theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary} />
                  </View>
                  <ThemedText style={[styles.cardText, { color: theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary, fontWeight: '600' }]}>Create New Tracker</ThemedText>
                </View>
              </Card>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </>
    ):(
      <SignIn setPassedAuth={setPassedAuth} />
    ))
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingBottom: 32,
  },
  welcomeSection: {
    width: "100%",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "400",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
    alignSelf: "flex-start",
    letterSpacing: -0.3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },
  createButton: {
    borderWidth: 2,
    borderStyle: "dashed",
  },
  emptyStateContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  fullWidthCard: {
    width: "100%",
  },
});