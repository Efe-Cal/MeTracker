import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite/next';
import { router } from 'expo-router';

export default function CustomTrackersSettings() {
	const { name } = useLocalSearchParams() as { name: string };

	const doReset = async () => {
		// Open the customTrackers DB to get the tracker ID
		const customTrackersDB = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
		const tracker = await customTrackersDB.getFirstAsync(
			`SELECT id FROM trackers WHERE name = ?`, [name]
		) as { id: number } | undefined;
		if (!tracker) {
			console.error(`Tracker "${name}" not found.`);
			return;
		}
		// Open MeTracker DB and delete all rows from the corresponding tracker table
		const db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
		await db.runAsync(`DELETE FROM tracker_${tracker.id}`);
		console.log(`Custom tracker "${name}" (tracker_${tracker.id}) has been reset.`);
		router.back();
	}

	const handleReset = () => {
		Alert.alert(
			"Reset Custom Trackers",
			"Are you sure you want to reset all custom trackers? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Reset", onPress: doReset, style: "destructive" }
			]
		);
	};
	const doDelete = async () => {
		// Open the customTrackers DB to get the tracker ID
		const customTrackersDB = await SQLite.openDatabaseAsync("customTrackers.db", { useNewConnection: true });
		const tracker = await customTrackersDB.getFirstAsync(
			`SELECT id FROM trackers WHERE name = ?`, [name]
		) as { id: number } | undefined;
		if (!tracker) {
			console.error(`Tracker "${name}" not found.`);
			return;
		}
		// Open MeTracker DB and delete all rows from the corresponding tracker table
		const db = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
		await db.runAsync(`DELETE FROM tracker_${tracker.id}`);
		// Delete the tracker from customTrackers DB
		await customTrackersDB.runAsync(`DELETE FROM trackers WHERE id = ?`, [tracker.id]);
		const fields = await customTrackersDB.getAllAsync(
			`SELECT id, type FROM fields WHERE trackerId = ?`, [tracker.id]
		) as { id: number; type: string }[];

		for (const field of fields) {
			if (field.type === 'select') {
				await customTrackersDB.runAsync(
					`DELETE FROM tracker_${tracker.id}_select_options WHERE fieldId = ?`, [field.id]
				);
			}
		}
		await customTrackersDB.runAsync(`DELETE FROM fields WHERE trackerId = ?`, [tracker.id]);

		console.log(`Custom tracker "${name}" (tracker_${tracker.id}) has been deleted.`);
		router.navigate("/");
	}

	const handleDelete = () => {
		Alert.alert(
			"Delete Custom Tracker",
			`Are you sure you want to delete the custom tracker "${name}"? This action cannot be undone.`,
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", onPress: doDelete, style: "destructive" }
			]
		);
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={{ padding: 10, backgroundColor: '#d32f2f', borderRadius: 5 }}
				onPress={handleReset}
			>
				<ThemedText style={{ color: '#fff', fontSize: 16 }}>Reset Tracker</ThemedText>
			</TouchableOpacity>

			<TouchableOpacity
				style={{ padding: 10, backgroundColor: '#d32f2f', borderRadius: 5, marginTop: 15 }}
				onPress={handleDelete}
			>
				<ThemedText style={{ color: '#fff', fontSize: 16 }}>Delete Tracker</ThemedText>
			</TouchableOpacity>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
});