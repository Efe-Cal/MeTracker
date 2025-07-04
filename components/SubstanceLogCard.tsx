import React from 'react';
import { View } from 'react-native';
import { getLocales } from 'expo-localization';
import { Card } from './Card';
import { ThemedText } from './ThemedText';
import type { IntakeEntry } from '../types';



const locale = getLocales()[0].languageTag as string;
export default function SubstanceLogCard({log}: {log: IntakeEntry}) {
    const time = new Date(log.time.replace("T", " ")+"Z");
    const dateString = time.toLocaleDateString(locale,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const timeString = time.toLocaleTimeString(locale,{ hour: '2-digit', minute: '2-digit' });
    return (
        <Card key={timeString}>
            <View>
                <ThemedText>{dateString}</ThemedText>
                <ThemedText>{timeString}</ThemedText>
            </View>
            <ThemedText>{log.amount} mg</ThemedText>
        </Card>
    );
}

