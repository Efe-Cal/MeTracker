import { View, StyleSheet } from 'react-native';
import SubstanceDecayGraph from '@/components/SubstanceDecayGraph';
import { useContext } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { FloatingPlusButton } from '@/components/FloatingPlusButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';
import { useIntakes } from '@/hooks/useIntakes';
import SubstanceLogCard from '@/components/SubstanceLogCard';

export default function CustomSubstanceTracker(){
    const { name } = useLocalSearchParams<{ name: string }>();
    const intakes = useIntakes(name);
    const { theme } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: theme === "dark" ? "#18181b" : "#f8f9fa" }]}>
            <SubstanceDecayGraph intakes={intakes} halflife={4} theme={theme} substanceName={name}/>
            
            <ThemedText style={{marginTop:10}}>Intakes: </ThemedText>
            {intakes.reverse().slice(0,11).map((intake) => {
                return (
                    <SubstanceLogCard key={intake.time} log={intake} />
                );
            })}

            <FloatingPlusButton onPress={() => router.navigate({pathname:'/customTrackers/substance/add', params: { name }})} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        padding: 20
    }
});
