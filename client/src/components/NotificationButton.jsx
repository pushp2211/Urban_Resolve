import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications';
function NotificationButton() {
  const navigate = useNavigate();
  const handleNotifcationButtonClick = ()=>{
    navigate("/notifications")
  }
  return (
    <Tooltip title="Notifications">
    <IconButton
      onClick={handleNotifcationButtonClick}
    >
         <NotificationsIcon color='error'/>
    </IconButton>
    </Tooltip>
  )
}

export default NotificationButton