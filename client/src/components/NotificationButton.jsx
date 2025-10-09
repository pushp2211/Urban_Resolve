import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications';
function NotificationButton() {
  const navigate = useNavigate();
  const handleNotifcationButtonClick = ()=>{
    navigate("/notifications")
  }
  return (
    <Button
      onClick={handleNotifcationButtonClick}
    >
         <NotificationsIcon color='error'/>
    </Button>
  )
}

export default NotificationButton