import Box from '@mui/material/Box'
import React from 'react'
import CategoryButtons from './CategoryButtons'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import NotificationButton from './NotificationButton'
import ReportModalButton from './ReportModalButton'
function FilterBar() {
  return (
    <Box
        sx={{
            // width:'100%',
            marginY:{
              xs:"1.2rem",
              lg:"2rem"
            },
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between"
        }}
        // minWidth='full'
    >
   <CategoryButtons />
   <Box
    sx={{
      display:"flex",
      gap:1
    }}
   >
    {/* <ReportModalButton/>
    <NotificationButton/> */}
   </Box>
    </Box>

  )
}
export default FilterBar