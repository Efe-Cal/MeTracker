import React, { useContext, useState } from 'react';
import {TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';

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
        <ThemedView style={[styles.container]}>
            <ThemedText style={styles.title}>{isSettingPin ? 'Set a PIN' : 'Enter your PIN'}</ThemedText>
            <TextInput
            style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            placeholder="PIN"
            placeholderTextColor={theme === 'dark' ? '#888' : '#ccc'}
            />
            <TouchableOpacity
            style={[
                {
                backgroundColor: theme === 'dark' ? '#444' : '#ddd',
                paddingVertical: 14,
                borderRadius: 24,
                alignItems: 'center',
                marginTop: 8,
                }
            ]}
            activeOpacity={0.8}
            onPress={isSettingPin ? handleSetPin : handleSignIn}
            >
            <ThemedText style={{ color: theme === 'dark' ? '#fff' : '#000', fontSize: 18, fontWeight: 'bold' }}>
                {isSettingPin ? 'Set PIN' : 'Sign In'}
            </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 18,
        textAlign: 'center',
    },
});