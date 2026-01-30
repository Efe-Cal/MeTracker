import { View, TextInput, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useContext } from "react";
import { ThemeContext } from "@/theme/ThemeContext";
import { Colors } from "@/constants/Colors";

type TextFieldProps = {
    label: string;
    value: string;
    onValueChange: (val: string) => void;
    placeholder?: string;
};

export function TextField({
    label,
    value,
    onValueChange,
    placeholder = "",
}: TextFieldProps) {
    const { theme } = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <ThemedText style={[styles.label, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>{label}</ThemedText>
            <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme === "dark" ? Colors.dark.inputBackground : Colors.light.inputBackground,
                    color: theme === "dark" ? Colors.dark.text : Colors.light.text,
                    borderColor: theme === "dark" ? Colors.dark.inputBorder : Colors.light.inputBorder,
                  }
                ]}
                value={value}
                onChangeText={onValueChange}
                multiline={true}
                numberOfLines={3}
                placeholderTextColor={theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary}
                placeholder={placeholder??"Enter text"}
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
        minHeight: 80,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        width: "100%",
        minHeight: 80,
        maxHeight: 120,
        textAlignVertical: "top",
    },
});