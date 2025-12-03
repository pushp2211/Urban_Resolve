import { Box, Typography } from '@mui/material'
import React from 'react'
import MarqueeEffect from './MarqueeEffect'
function Welcome() {
  return (
    <Box
    
        sx={{
            marginTop:"6rem",
            display:"flex",
            flexDirection:"column",
            gap:"3rem",
            alignItems:"center",
        }}
    >
        <Box
            sx={{
                display:"flex",
                flexDirection:"column",
                alignItems:"center"
            }}
        >
            <Typography variant='overline'
                sx={{
                    fontSize:{
                        lg:"5rem",
                        md:"4rem",
                        sm:"2.8rem",
                        xs:"2.2rem",
                    },
                    textAlign:"center"
                }}
            >
                URBAN RESOLVE
            </Typography>
            <Typography
                variant='caption'
                sx={{
                    marginTop:{
                        lg:"-3.8rem",
                        md:"-3rem",
                        sm:"-2rem",
                        xs:"-1.6rem"
                    },
                    fontSize:{
                        lg:"1.8rem",
                        md:"1.5rem",
                        sm:"1.3rem",
                        xs:"1rem",
                    }
                }}
                
            >
                Report, Track and Resolve
            </Typography>
        </Box>
        <Box
            sx={{
                display:"flex",
                flexDirection:"column",
                alignItems:"center",

            }}
        >
                <Typography
                    variant='body1'
                    sx={{
                        fontSize:"2rem",
                        textAlign:"center",
                    }}

                >
                    Transform How Your City Responds
                </Typography>
                <Typography
                    variant='body1'
                    sx={{
                        fontSize:"1.19rem",
                        textAlign:"center",
                    }}
                >
                    A unified platform for citizens and municipal bodies to report, manage, and resolve urban issues.
                </Typography>
        </Box>
        <MarqueeEffect/>
    </Box>
  )
}

export default Welcome