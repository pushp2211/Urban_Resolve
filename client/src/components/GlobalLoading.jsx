import { Backdrop, CircularProgress } from '@mui/material';
import { useLoading } from '../context/LoadingContext';
export default function GlobalLoading({ open }) {
    const {globalLoading} = useLoading()
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        backdropFilter:"blur(10px)" // ensure it's on top
      }}
      open={globalLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}