import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type NumberFieldProps = {
  label: string;
  value: number | string;
  onValueChange: (value: number) => void;
};

export function NumberField({ label, value, onValueChange }: NumberFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value?.toString() ?? ""}
        onChangeText={text => {
          const num = parseFloat(text);
          onValueChange(isNaN(num) ? 0 : num);
        }}
        placeholder="Enter number"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: "100%",
    justifyContent:"space-between",
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
