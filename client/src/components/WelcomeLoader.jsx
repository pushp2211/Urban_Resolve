import { CircularProgress, Box } from "@mui/material";
import {Typography} from "@mui/material";
import { PropagateLoader } from "react-spinners";
import { useTheme } from '@mui/material/styles';
function WelcomeLoader() {
    const theme = useTheme();
  return (
    <Box
  sx={{
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  }}
>
  <PropagateLoader 
    color={theme.palette.mode === "dark" ? "#ffffff" : "#000000"}

  />
  <Typography>
    Starting server...
  </Typography>
  <Typography color="text.secondary" variant="button">
     Warming up the engines...
     
  </Typography>
  <Typography>
    Almost there! The server is getting ready for action.
  </Typography>
</Box>
  );
}

export default WelcomeLoader;