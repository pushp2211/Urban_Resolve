import React from 'react'
import { Modal , Typography, Box, TextField, Paper, Button} from '@mui/material'

function AdminFilterModal({filterOptions, openFilter, handleFilterClose, handleFilterChange}) {
  return (
    <Modal
        open={openFilter}
        onClose={handleFilterClose}
        sx={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            backdropFilter: "blur(6px)",
        }}
    >
        <Paper
            sx={{
                minWidth:{
                    lg:"25rem"
                },
                display:"flex",
                flexDirection:"column",
                gap:2,
                padding:3,
                borderRadius:"2rem"
            }}
        >
            <Typography variant='button'
                sx={{
                    textAlign:"center",
                    fontSize:15
                }}
                
            >
            Enter the desired filters
        </Typography>
        {filterOptions.map((element, index)=>(
            <Box key={element.label} 
                sx={{
                    display:"flex",
                    flexDirection:"row",
                    justifyContent:"space-between",
                    alignItems:"center",
                }}
            >
                <Typography variant='button'>
                    {element.label}
                </Typography>
                <TextField id="filter" size='small' label={element.label} variant="outlined" 
                    onChange={(e)=>handleFilterChange(element.label, e.target.value.toLowerCase())}
                />
            </Box>
        ))}
        <Button
            onClick={handleFilterClose}
        >
            Close
        </Button>
        </Paper>
    </Modal>
  )
}

export default AdminFilterModal