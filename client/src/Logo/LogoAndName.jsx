import { Box, Typography } from "@mui/material"
import Logo from "./Logo"

function LogoAndName() {
  return (
    <Box
        sx={{
          fontWeight:"bold",
          fontSize:"1rem",
          display:"flex",
          flexDirection:"row",
          gap:1,
          alignItems:"center",
          justifyContent:"center",
        }}
      >
        <Logo/>
        <Typography 
          sx={{
            fontWeight:"bold",
            fontSize:"1rem",
            paddingTop:1
          }}
        >
          Urban Resolve
        </Typography>
      </Box>
  )
}

export default LogoAndName