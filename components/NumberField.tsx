import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';
import { Colors } from '@/constants/Colors';

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
        placeholderTextColor={theme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    minWidth: 100,
  }
});
