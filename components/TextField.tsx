import { View, Text, TextInput, StyleSheet } from "react-native";

type TextFieldProps = {
    label: string;
    value: string;
    onValueChange: (val: string) => void;
};

export function TextField({
    label,
    value,
    onValueChange
}: TextFieldProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input]}
                value={value}
                onChangeText={onValueChange}
                multiline={true}
                numberOfLines={3}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginVertical: 8,
        minHeight: 80, // Ensure visible height
    },
    label: {
        fontSize: 18,
        marginRight: 12,
        marginBottom: 4,
    },
    input: {
        flex: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "#fff",
        width: "100%",
        minHeight: 40, // Ensure visible height
        maxHeight: 100
    },
});