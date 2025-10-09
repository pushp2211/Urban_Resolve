import Box from '@mui/material/Box'
import React from 'react'
import CategoryButtons from './CategoryButtons'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
function FilterBar() {
  return (
    <Box
        sx={{
            // width:'100%',
            marginY:{
              xs:"1.2rem",
              lg:"2rem"
            }
        }}
        // minWidth='full'
    >
   <CategoryButtons />
    </Box>

  )
}
export default FilterBar