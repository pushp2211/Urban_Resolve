// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Typography } from "@mui/material";
import theme from "../theme";
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        setTimeout(()=>{

            if(verified === true){
                navigate("/login");
            }
        }, [4000])
        
    }, [verified]);
//   useEffect(() => {
    
//     verify();
//   }, [searchParams]);
    const verifyHandle = async () => {
        setLoading(true);
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("Invalid verification link.");
        return;
      }
      setVerified(false);

      try {
        const response = await apiClient.get(
          `/user/verify/verify-email`,
          { params: { token, email } }
        );
        console.log(response);
        // if (res.data.data.success) {
        //   setStatus("Email verified successfully! You can now log in.");
        // }
        setVerified(true);
      } catch (err) {
        const msg =
          err.response?.data?.message || "Verification failed or link expired.";
            setStatus(` ${msg}`);
      }
      finally{
        setLoading(false);
      }
    };

  return (
    <Paper style={{ padding: "3.5rem", textAlign: "center", minHeight:"100svh", display:"flex",
        flexDirection:"column",
        gap:45,
        alignItems:"center",
        justifyContent:"center"
        // marginY:"20rem"
     }}>
        <Typography
            sx={{
                fontSize:{
                    xs:"2.5rem",
                    md:"3rem"
                }
            }}
        >
                Welcome to Urban Resolve
        </Typography>
        <Typography variant="h3"
            sx={{
                fontSize:{
                    xs:"2rem",
                    md:"2.5rem"
                },
                fontStyle:"italic"
            }}
        >
            "Because every small complaint can spark big change"
        </Typography>
        <Typography variant="button"
            sx={{
                fontSize:{
                    xs:"1rem",
                    md:"1.5rem"
                }
            }}
        >
            Click the button below to verify your email
        </Typography>
        <Button
        variant="contained"
            disabled = {verified}
            onClick={verifyHandle}
            sx={{
                width:"15rem",
                backgroundColor:theme.palette.mode === "dark"?"white":"black",
                
            }}
            loading={loading}
            loadingIndicator="Verifying…"
        >
            Verify your Email
        </Button>
      {/* <h2>{status}</h2> */}
      {verified && <Typography variant="button"

      >Redirecting to login...</Typography>}
    </Paper>
  );
}