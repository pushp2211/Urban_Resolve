import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ThemeToggleContext = createContext();

export const useThemeToggle = () => useContext(ThemeToggleContext);

export function CustomThemeProvider({ children }) {
  const savedTheme = localStorage.getItem('UrbanResolveTheme');
  const isDarkMode =  window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [mode, setMode] = useState(savedTheme !== "undefined" ? savedTheme : (isDarkMode?"dark":"light"));

  const toggleTheme = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  useEffect(()=>{
    localStorage.setItem('UrbanResolveTheme', mode);
  }, [mode]);
  

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === "dark" ? "#121212" : "#f5f5f5",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}
