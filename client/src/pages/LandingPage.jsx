import React from 'react'
import LandingNav from '../components/landing/LandingNav'
import Welcome from '../components/landing/Welcome'
import { Container, Box } from '@mui/material'
import Statistics from '../components/landing/Statistics'
import ClosingBanner from '../components/landing/ClosingBanner'
import Footer from '../components/landing/Footer'

import { useRef } from 'react'
function LandingPage() {
  const homeRef = useRef();
  const statsRef = useRef();

  const scrollToSection = (ref)=>{
    ref.current?.scrollIntoView({
      behavior:"smooth",
      block:"start",
    })
  }
  const refs = {
    home:homeRef,
    stats: statsRef
  }
  return (
    <>
    <Container
        maxWidth="lg"
        sx={{
            // bgcolor:'green',
            minHeight:'100svh'
        }}
    >
        <LandingNav scrollControl = {scrollToSection} refs={refs}/>
        <Box ref={homeRef} sx={{
          scrollMarginTop:"6rem"
        }}>
          <Welcome/>
        </Box>
        <Box ref={statsRef}
          sx={{
            scrollMarginTop:"5rem"
          }}
        >
          <Statistics/>
        </Box>
        <ClosingBanner/>
        
    </Container>
    <Footer/>
    </>
  )
}

export default LandingPage