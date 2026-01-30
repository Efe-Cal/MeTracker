import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Switch, TextInput, TouchableOpacity } from "react-native";
import { ThemeContext } from "@/theme/ThemeContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as SecureStore from 'expo-secure-store';
import { Colors } from "@/constants/Colors";

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
				<View style={styles.settingInfo}>
					<ThemedText style={[styles.label, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>Dark Theme</ThemedText>
					<ThemedText style={[styles.description, { color: theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
						Use dark color scheme
					</ThemedText>
				</View>
				<Switch
					value={theme === "dark"}
					onValueChange={toggleTheme}
					trackColor={{ false: "#d1d5db", true: theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary }}
					thumbColor="#ffffff"
				/>
			</View>
			<View style={styles.settingRow}>
				<View style={styles.settingInfo}>
					<ThemedText style={[styles.label, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>App Lock</ThemedText>
					<ThemedText style={[styles.description, { color: theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
						Secure app with PIN
					</ThemedText>
				</View>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					{appLock && <TouchableOpacity
						style={[styles.changeButton, { 
							backgroundColor: theme === "dark" ? Colors.dark.cardBackground : Colors.light.cardBackground,
							borderColor: theme === "dark" ? Colors.dark.cardBorder : Colors.light.cardBorder,
						}]}
						onPress={() => setSettingPin(!settingPin)}
						activeOpacity={0.7}
					>
						<ThemedText style={{ color: theme === "dark" ? Colors.dark.text : Colors.light.text, fontSize: 14 }}>
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
						trackColor={{ false: "#d1d5db", true: theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary }}
						thumbColor="#ffffff"
					/>
				</View>
			</View>
			{settingPin && (
				<ThemedView style={styles.pinSection}>
					<ThemedText style={[styles.label, { color: theme === "dark" ? Colors.dark.text : Colors.light.text, marginBottom: 12 }]}>Set new PIN</ThemedText>
					<TextInput
						style={[styles.input, { 
							color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
							backgroundColor: theme === 'dark' ? Colors.dark.inputBackground : Colors.light.inputBackground,
							borderColor: theme === 'dark' ? Colors.dark.inputBorder : Colors.light.inputBorder,
						}]}
						value={pin}
						onChangeText={setPin}
						placeholder="Enter new PIN"
						placeholderTextColor={theme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary}
						keyboardType="numeric"
						secureTextEntry
						maxLength={6}
					/>
					<TouchableOpacity
						style={[styles.button, { backgroundColor: theme === 'dark' ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary }]}
						onPress={() => handleSetPin(pin)}
						activeOpacity={0.7}
					>
						<ThemedText style={{ color: '#ffffff', fontWeight: '600' }}>Set PIN</ThemedText>
					</TouchableOpacity>
					
				</ThemedView>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "flex-start",
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 24,
		paddingVertical: 4,
	},
	settingInfo: {
		flex: 1,
		marginRight: 16,
	},
	label: {
		fontSize: 17,
		fontWeight: "600",
		marginBottom: 4,
	},
	description: {
		fontSize: 14,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		fontSize: 16,
		width: '100%',
	},
	button: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 8,
	},
	changeButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		marginRight: 12,
		borderWidth: 1,
	},
	pinSection: {
		marginTop: 8,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
	},
});
