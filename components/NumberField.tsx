import React, { useContext, useState, useEffect } from 'react';
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
  const [inputValue, setInputValue] = useState(value?.toString() ?? "");

  useEffect(() => {
    setInputValue(value?.toString() ?? "");
  }, [value]);

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
        keyboardType="decimal-pad"
        value={inputValue}
        onChangeText={text => {
          // Allow only numbers, optional decimal, and optional leading minus
          if (/^-?\d*\.?\d*$/.test(text)) {
            setInputValue(text);
            // Only call onValueChange if text is a valid number (not just "-" or ".")
            // and does not end with a lone decimal point
            if (
              text !== "" &&
              text !== "-" &&
              text !== "." &&
              text !== "-." &&
              !text.match(/^-?\d+\.$/)
            ) {
              const num = parseFloat(text);
              if (!isNaN(num)) {
                onValueChange(num);
              }
            }
          }
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
    marginBottom: 2
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 6,
    paddingHorizontal:8,
    fontSize: 16
  }
});
