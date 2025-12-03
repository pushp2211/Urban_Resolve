import React from 'react'
import LandingNav from '../components/landing/LandingNav'
import Welcome from '../components/landing/Welcome'
import { Container } from '@mui/material'
import Statistics from '../components/landing/Statistics'
import ClosingBanner from '../components/landing/ClosingBanner'
import Footer from '../components/landing/Footer'
function LandingPage() {
  return (
    <>
    <Container
        maxWidth="lg"
        sx={{
            // bgcolor:'green',
            minHeight:'100svh'
        }}
    >
        <LandingNav/>
        <Welcome/>
        <Statistics/>
        <ClosingBanner/>
        
    </Container>
    <Footer/>
    </>
  )
}

export default LandingPage