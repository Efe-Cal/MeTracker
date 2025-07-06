import React, { useContext } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { ThemeContext } from '@/theme/ThemeContext';

type ThemedDropdownProps = {
  data: { label: string; value: string }[];
  value: string;
  onChange: (item: { label: string; value: string }) => void;
  labelField: "label"|"value";
  valueField: "label"|"value";
  style?: any;
  containerStyle?: any;
  placeholderStyle?: any;
  selectedTextStyle?: any;
  itemTextStyle?: any;
  activeColor?: string;
  [key: string]: any; // allow additional Dropdown props
};

export function ThemedDropdown({
  data,
  value,
  onChange,
  labelField,
  valueField,
  style,
  containerStyle,
  placeholderStyle,
  selectedTextStyle,
  itemTextStyle,
  activeColor,
  ...rest
}: ThemedDropdownProps) {
  const { theme } = useContext(ThemeContext);

  const mergedPlaceholderStyle = Object.assign(
    { color: theme === "dark" ? "#bbb" : "#888" },
    typeof placeholderStyle === "object" && placeholderStyle ? placeholderStyle : {}
  );
  const mergedSelectedTextStyle = Object.assign(
    { color: theme === "dark" ? "#fff" : "#222" },
    typeof selectedTextStyle === "object" && selectedTextStyle ? selectedTextStyle : {}
  );
  const mergedItemTextStyle = Object.assign(
    { color: theme === "dark" ? "#fff" : "#222" },
    typeof itemTextStyle === "object" && itemTextStyle ? itemTextStyle : {}
  );

  return (
    <Dropdown
      data={data}
      value={value}
      onChange={onChange}
      labelField={labelField}
      valueField={valueField}
      style={[
        {
          borderColor: theme === "dark" ? "#444" : "#ccc",
          borderRadius: 10,
          borderWidth: 1,
          padding: 10,
          backgroundColor: theme === "dark" ? "#222" : "#f8f9fa"
        },
        style,
      ]}
      containerStyle={[
        {
            backgroundColor: theme === "dark" ? "#222" : "#fff",
            borderColor: theme === "dark" ? "#444" : "#ccc",
            borderRadius: 10,
        },
        containerStyle,
      ]}
      placeholderStyle={mergedPlaceholderStyle}
      selectedTextStyle={mergedSelectedTextStyle}
      itemTextStyle={mergedItemTextStyle}
      activeColor={activeColor ?? (theme === "dark" ? "#333" : "#e0e0e0")}
      {...rest}
    />
  );
}

export default ThemedDropdown;
