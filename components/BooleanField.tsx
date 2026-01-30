import { View, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { ThemedText } from "./ThemedText";
import { useContext } from "react";
import { ThemeContext } from "@/theme/ThemeContext";
import { Colors } from "@/constants/Colors";

type BooleanFieldProps = {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
};

export function BooleanField({ label, value, onValueChange, disabled }: BooleanFieldProps) {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <ThemedText style={[styles.label, { color: theme === "dark" ? Colors.dark.text : Colors.light.text }]}>{label}</ThemedText>
      <Checkbox
        value={value}
        onValueChange={onValueChange}
        color={value ? (theme === "dark" ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary) : (theme === "dark" ? Colors.dark.inputBorder : Colors.light.inputBorder)}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 12,
  }
});
