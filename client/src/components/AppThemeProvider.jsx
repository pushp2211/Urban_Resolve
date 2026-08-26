import React, { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

export function AppThemeProvider({ children }) {
  const mode = useSelector((state) => state.theme?.mode || 'light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === 'dark' ? '#121212' : '#f5f5f5',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default AppThemeProvider;
