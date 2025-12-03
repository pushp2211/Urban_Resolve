import { createTheme } from '@mui/material/styles';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = createTheme({
  palette: {
    mode: 'light', // Can be 'light' or 'dark'
  },
});

export default theme;