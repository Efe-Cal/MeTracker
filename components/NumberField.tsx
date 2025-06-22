import React, { useContext } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';

type NumberFieldProps = {
  label: string;
  value: number | string;
  onValueChange: (value: number) => void;
};

export function NumberField({ label, value, onValueChange }: NumberFieldProps) {
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
        keyboardType="numeric"
        value={value?.toString() ?? ""}
        onChangeText={text => {
          const num = parseFloat(text);
          onValueChange(isNaN(num) ? 0 : num);
        }}
        placeholder="Enter number"
        placeholderTextColor={theme === "dark" ? "#888" : "#aaa"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  label: {
    fontSize: 16,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    fontSize: 16
  }
});
