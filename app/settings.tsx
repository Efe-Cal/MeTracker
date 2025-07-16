import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Switch, TextInput, Touchable, TouchableOpacity } from "react-native";
import { ThemeContext } from "@/theme/ThemeContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'user_pin';

export default function Settings() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [appLock, setAppLock] = useState(false);
	const [ settingPin, setSettingPin ] = useState(false);
	const [pin, setPin] = useState('');

	const handleSetPin = async (pin: string) => {
		if (pin.length < 4) {
			alert('PIN must be at least 4 digits');
			return;
		}
		await SecureStore.setItemAsync(PIN_KEY, pin);
		alert('PIN set!');
	};
	

	useEffect(() => {
		const checkAppLock = async () => {
			const pin = await SecureStore.getItemAsync(PIN_KEY);
			setAppLock(!!pin);
		};
		checkAppLock();
	}, []);

	return (
		<ThemedView style={styles.container}>
			<View style={styles.settingRow}>
				<ThemedText style={styles.label}>Dark Theme</ThemedText>
				<Switch
					value={theme === "dark"}
					onValueChange={toggleTheme}
				/>
			</View>
			<View style={styles.settingRow}>
				<ThemedText style={styles.label}>App Lock</ThemedText>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					{appLock && <TouchableOpacity
						style={[styles.button, { backgroundColor: theme === "dark" ? "#27272a" : "#e5e7eb",marginRight: 8,padding: 8 }]}
						onPress={() => setSettingPin(!settingPin)}
					>
						<ThemedText style={{ color: theme === "dark" ? "#fff" : "#222" }}>
							Change PIN
						</ThemedText>
					</TouchableOpacity>}
					<Switch
						value={appLock}
						onValueChange={()=>{
							setAppLock(!appLock);
							if (!appLock) {
								setSettingPin(true);
							} else {
								setSettingPin(false);
								SecureStore.deleteItemAsync(PIN_KEY);
							}
						}}
					/>
				</View>
			</View>
			{settingPin && (
				<ThemedView>
					<ThemedText>Set new PIN</ThemedText>
					<TextInput
						style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
						value={pin}
						onChangeText={setPin}
						placeholder="Enter new PIN"
						placeholderTextColor={theme === 'dark' ? '#888' : '#ccc'}
						keyboardType="numeric"
						secureTextEntry
						maxLength={6}
					/>
					<TouchableOpacity
						style={[styles.button, { backgroundColor: theme === 'dark' ? '#27272a' : '#e5e7eb' }]}
						onPress={() => handleSetPin(pin)}
					>
						<ThemedText style={{ color: theme === 'dark' ? '#fff' : '#222' }}>Set PIN</ThemedText>
					</TouchableOpacity>
					
				</ThemedView>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		justifyContent: "flex-start",
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 24
	},
	label: {
		fontSize: 18,
		fontWeight: "bold"
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
		marginBottom: 16,
		color: '#000',
		width: '100%',
	},
	button: {
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 8,
	},
});
