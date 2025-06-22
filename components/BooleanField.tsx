import { View, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { ThemedText } from "./ThemedText";
import { useContext } from "react";
import { ThemeContext } from "@/theme/ThemeContext";

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
      <ThemedText style={[styles.label, { color: theme === "dark" ? "#fff" : "#222" }]}>{label}</ThemedText>
      <Checkbox
        value={value}
        onValueChange={onValueChange}
        color={value ? "#4630EB" : theme === "dark" ? "#444" : undefined}
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
    marginVertical: 8
  },
  label: {
    fontSize: 18,
    marginRight: 12
  }
});
