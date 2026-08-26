import React from 'react';
import { Backdrop, Fade } from '@mui/material';
import { useLoading } from '../hooks/useLoading';
import { GridLoader } from 'react-spinners';
import { DotLoader } from 'react-spinners';
import { useTheme } from '@mui/material/styles';

export default function GlobalLoading() {
  const theme = useTheme();
  const { globalLoading } = useLoading();

  if (!globalLoading) return null;

  return (
    <Fade in={globalLoading} timeout={150}>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (t) => t.zIndex.drawer + 9999,
          backdropFilter: 'blur(8px)',
          pointerEvents: globalLoading ? 'auto' : 'none',
        }}
        open={globalLoading}
      >
        <DotLoader
          color={theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}
          size={60}
        />
      </Backdrop>
    </Fade>
  );
}
