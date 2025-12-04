import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, {useState} from 'react'
import {  useSearchParams } from 'react-router-dom'
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { COMPLAINT_STATUS } from '../../enum/ComplaintStatus'
// pinCode, locality, city, dateRange, status

import { useLoading } from '../context/LoadingContext'

function CategoryButtons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState("");
  const {showLoading, hideLoading} = useLoading();
  const handleChange = (e)=>{
    setSelected(e.target.value)
  }
  const {user} = useAuth();
  const filters = [
    {label:'This Month', key:'dateRange', value:'this_month'},
    {label:'My City',key:'city', value:user.address?.city},
    {label:'My Pincode',key:'pinCode',  value:user.address?.pinCode},
    {label:'Pending',key:'status',  value:COMPLAINT_STATUS.PENDING},
    {label:'In Progress',key:'status',  value:COMPLAINT_STATUS.IN_PROGRESS},
    {label:'Resolved',key:'status',  value:COMPLAINT_STATUS.RESOLVED},
    {label:'Rejected',key:'status',  value:COMPLAINT_STATUS.REJECTED},
  ]

  const handleClick = (key, value)=>{
    // console.log(value)
    // navigate(`${value}`)
    setSearchParams({[key]:value})
  }

  return (
    <>
    <Box
      sx={{
        display:{
          xs:"none",
          md:"flex"
        },
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
    <FormControl size="small" sx={{ minWidth: 150,

      display:{
        // sm:"block",
        md:"none"
      },
      
     }}>
          <InputLabel id="filter-select-label">Filter</InputLabel>
          <Select
            labelId="filter-select-label"
            id="filter-select"
            value={selected}
            label="Filter"
            onChange={handleChange}
            sx={{
              borderRadius:"2rem"
            }}
          >
            <MenuItem onClick={()=>(setSearchParams({}))}
                sx={{
                  fontSize:"0.89rem",
                  textAlign:"center"
                }}
              >
                None
              </MenuItem>
            {filters.map((filter, idx) => (
              <MenuItem key={idx} value={filter.value} onClick={()=>handleClick(filter.key, filter.value)}
                sx={{
                  fontSize:"0.89rem",
                  textAlign:"center"
                }}
              >
                {filter.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    </>
  )
}

export default CategoryButtons