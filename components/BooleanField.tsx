import { View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";

type BooleanFieldProps = {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
};

export function BooleanField({ label, value, onValueChange, disabled }: BooleanFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Checkbox value={value} onValueChange={onValueChange} color={value ? "#4630EB" : undefined} disabled={disabled} />
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
