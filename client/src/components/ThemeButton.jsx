// src/components/ThemeButton.jsx
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ThemeButton() {
  const isLight = mode === 'light';

  return (
    <Tooltip title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton
        color="inherit"
        onClick={toggleTheme}
        sx={{
          ml: 1,
          bgcolor: 'transparent',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        {isLight ? (
          <DarkModeIcon sx={{ color: '#ffa726' }} />
        ) : (
          <LightModeIcon sx={{ color: '#fff59d' }} />
        )}
      </IconButton>
    </Tooltip>
  );
}