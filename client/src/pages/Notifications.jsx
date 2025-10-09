import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
} from '../api/notificationApi';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import NotificationList from '../components/NotificationList';
function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState('');
  const [markAsReadLoading, setMarkAsReadLoading] = useState(false);
  const [markAsReadMessage, setMarkAsReadMessage] = useState('');

  const [unReadListOpen, setUnReadListOpen] = useState(false);
  const[readListOpen, setReadListOpen] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) {
      return;
    }
    const fetchNotifications = async () => {
      setNotificationError('');
      setNotificationLoading(false);

      try {
        setNotificationLoading(true);
        const response = await getNotifications();
        if (response.status !== 200) {
          setNotificationError('error while fetching notifications');
        }
        console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        setNotificationError('Error occured while fetching the notifications');
        console.log('error while fetching notifications', error);
      } finally {
        setNotificationLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);
    const readNotifications = notifications.filter((n) => n.read_status);
    const unreadNotifications = notifications.filter((n) => !n.read_status);

  const openUnRead = () => {
    setReadListOpen(true);
    setUnReadListOpen(false);
  };
  const openRead = () => {
    setUnReadListOpen(true);
    setReadListOpen(false);

  };
  const onMarkAsRead = (notification) => {
    setMarkAsReadMessage('');
    setMarkAsReadLoading(false);
    try {
      setMarkAsReadLoading(true);
      const response = markNotificationAsRead(notification?._id);
      if (response.status === 200) {
        setNotificationReadMessage('Marked as read successfully');
      }
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read_status: true } : n))
      );
    } catch (error) {
      setNotificationReadMessage('Error occured while marking read.');
      console.log(error);
    } finally {
      setMarkAsReadLoading(false);
    }
  };

  return (
    <Container
      disableGutters
      // maxWidth="xl"
      sx={{
        // marginY:'2rem',
        paddingX: 4,
        display: 'flex',
        flexDirection: 'column',
        // justifyContent:"",
        // alignItems: "flex-end",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
        }}
      >
        
        <Chip label="New Notifications" variant="outlined" onClick={openUnRead} />
        <Chip label="Read Notifications" variant="outlined" onClick={openRead} />
      </Box>
      {unReadListOpen && <NotificationList
        notifications={readNotifications}
        onMarkAsRead={onMarkAsRead}
      />}
      {readListOpen && <NotificationList
        notifications={unreadNotifications}
        onMarkAsRead={onMarkAsRead}
      />}
    </Container>
  );
}

export default Notifications;
