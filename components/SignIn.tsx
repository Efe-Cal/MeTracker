import React, { useContext, useState } from 'react';
import {TextInput, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

const PIN_KEY = 'user_pin';

export default function SignIn({ setPassedAuth, settingPin }: { setPassedAuth: (auth: boolean) => void,settingPin?: boolean }) {
    const [pin, setPin] = useState('');
    const [storedPin, setStoredPin] = useState<string | null>(null);
    const [isSettingPin, setIsSettingPin] = useState(settingPin || false);
    const { theme } = useContext(ThemeContext)

    React.useEffect(() => {
        (async () => {
            const savedPin = await SecureStore.getItemAsync(PIN_KEY);
            if (!savedPin){
                setPassedAuth(true);
            }
            else{setStoredPin(savedPin);}
            // setIsSettingPin(!savedPin);
        })();
    }, []);

    const handleSignIn = async () => {
        if (pin === storedPin) {
            setPassedAuth(true);
            setPin('');
        } else {
            Alert.alert('Error', 'Incorrect PIN');
        }
    };

    const handleSetPin = async () => {
        if (pin.length < 4) {
            Alert.alert('Error', 'PIN must be at least 4 digits');
            return;
        }
        await SecureStore.setItemAsync(PIN_KEY, pin);
        setStoredPin(pin);
        setIsSettingPin(false);
        setPin('');
        Alert.alert('Success', 'PIN set! Please sign in.');
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background }]}>
            <ThemedView style={[styles.content, { backgroundColor: 'transparent' }]}>
                <ThemedView style={[
                    styles.iconContainer, 
                    { backgroundColor: theme === 'dark' ? Colors.dark.cardBackground : Colors.light.cardBackground }
                ]}>
                    <Feather name="lock" size={48} color={theme === 'dark' ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary} />
                </ThemedView>
                <ThemedText style={[styles.title, { color: theme === 'dark' ? Colors.dark.text : Colors.light.text }]}>
                    {isSettingPin ? 'Set a PIN' : 'Enter PIN'}
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: theme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                    {isSettingPin ? 'Create a PIN to secure your app' : 'Enter your PIN to continue'}
                </ThemedText>
                <TextInput
                    style={[
                        styles.input, 
                        { 
                            color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
                            backgroundColor: theme === 'dark' ? Colors.dark.inputBackground : Colors.light.inputBackground,
                            borderColor: theme === 'dark' ? Colors.dark.inputBorder : Colors.light.inputBorder,
                        }
                    ]}
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={6}
                    placeholder="Enter PIN"
                    placeholderTextColor={theme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary}
                />
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: theme === 'dark' ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary }
                    ]}
                    activeOpacity={0.7}
                    onPress={isSettingPin ? handleSetPin : handleSignIn}
                >
                    <ThemedText style={styles.buttonText}>
                        {isSettingPin ? 'Set PIN' : 'Sign In'}
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 20,
        textAlign: 'center',
        width: '100%',
        letterSpacing: 8,
        fontWeight: '600',
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '600',
    },
});