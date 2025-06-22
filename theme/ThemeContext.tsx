import React, { createContext, useState, useEffect, useMemo } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

export const ThemeContext = createContext<{
  theme: ThemeType;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("light");

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      } else {
        setTheme(Appearance.getColorScheme() === "dark" ? "dark" : "light");
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
