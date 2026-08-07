import { Backdrop, CircularProgress, Fade, Box } from '@mui/material';
import { useLoading } from '../context/LoadingContext';
import { GridLoader } from 'react-spinners';
import { useTheme } from '@mui/material/styles';

export default function GlobalLoading({ open }) {
  const theme = useTheme();
    const {globalLoading} = useLoading()
  return (
    <Fade in={globalLoading} timeout={600}>
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        backdropFilter:"blur(10px)" // ensure it's on top
      }}
      open={globalLoading}
    >
      
  {/* <Box> */}
    <GridLoader
      color={theme.palette.mode === "dark" ? "#ffffff" : "#000000"}
    />
  {/* </Box> */}
    </Backdrop>
</Fade>
  );
}