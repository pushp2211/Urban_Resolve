import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CustomThemeProvider } from './context/ThemeContext.jsx'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import {theme} from './theme.js';
import { LoadingProvider } from './context/LoadingContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomThemeProvider>
    <LoadingProvider>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoadingProvider>
    </CustomThemeProvider>
  </StrictMode>,
)
