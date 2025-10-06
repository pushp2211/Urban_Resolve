import React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import VirtualList from 'rc-virtual-list';
import Avatar from '@mui/material/Avatar';
export default function StaffListDialog({ staffList, onSelectStaff, assignComplaint }) {


  return (
    <Box
      sx={{
        width:{
          md:'20rem',
          sm:'15rem'
          
        },

        // maxWidth: 360,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        margin:"1rem",
      }}
    >
      <VirtualList
        data={staffList}
        // height={ContainerHeight}
        itemHeight={46} // A typical height for a list item
        itemKey={(item) => item._id}
      >
        {/*
          This function receives the individual 'staff' object directly.
        */}
        {(staff) => (
          <ListItem key={staff._id} component="div" disablePadding>
            <ListItemButton onClick={() => assignComplaint(staff)}>
              {/* Now you can safely access staff.fullName */}
              <Box
                sx={{
                  display:"flex",
                  gap:1,
                  alignItems:"center",
                  justifyContent:"center"
                }}
              >
                <Avatar alt={staff.fullName} src={staff.profilePicture} />
                <ListItemText primary={staff.fullName} />
              </Box>
            </ListItemButton>
          </ListItem>
        )}
      </VirtualList>
    </Box>
  );
}