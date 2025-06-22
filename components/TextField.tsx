import { View, TextInput, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useContext } from "react";
import { ThemeContext } from "@/theme/ThemeContext";

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
    const { theme } = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <ThemedText style={[styles.label, { color: theme === "dark" ? "#fff" : "#222" }]}>{label}</ThemedText>
            <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme === "dark" ? "#222" : "#fff",
                    color: theme === "dark" ? "#fff" : "#222",
                    borderColor: theme === "dark" ? "#444" : "#ccc"
                  }
                ]}
                value={value}
                onChangeText={onValueChange}
                multiline={true}
                numberOfLines={3}
                placeholderTextColor={theme === "dark" ? "#888" : "#aaa"}
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