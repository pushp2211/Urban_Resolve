import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link as routerLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// pinCode, locality, city, dateRange, status



function CategoryButtons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {user} = useAuth();
  const filters = [
    {label:'This Month', key:'dateRange', value:'this_month'},
    {label:'My City',key:'city', value:user.address?.city},
    {label:'My pinCode',key:'pinCode',  value:user.address?.pinCode},
  ]
  const navigate = useNavigate();

  const handleClick = (key, value)=>{
    // console.log(value)
    // navigate(`${value}`)
    setSearchParams({[key]:value})
  }

  return (
    <Box
      sx={{
        display:'flex',
        gap:2,
      }}
    >
      {
        filters.map((filter, idx)=>(
          <Button 
            id={idx}
            key={idx}
            variant='outlined'
            sx={{
              borderRadius:'2rem',
              paddingX:'0.8rem',
              fontSize:{
                xs:"0.7rem",
                md:"1rem",
                lg:""
              }
            }}
            onClick={()=>handleClick(filter.key, filter.value)}
          >
            {filter.label}
          </Button>
        ))
      }
      {/* <Button
        variant="text"
        sx={{ textTransform: 'none' }}
        onClick={() => onFilterChange('clear', null)}
       >
        Clear All
       </Button> */}

    </Box>
  )
}

export default CategoryButtons