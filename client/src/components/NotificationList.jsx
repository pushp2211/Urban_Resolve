import { Box, Typography } from '@mui/material';
import NotificationItem from './NotificationItem';

export default function NotificationList({
  notifications = [],
  onMarkAsRead,
}) {
  if (!notifications.length) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          p: 3,
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2">
          No notifications available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {notifications.map((n) => (
        <NotificationItem
          key={n._id}
          notification={n}
          onMarkAsRead={() => onMarkAsRead(n)}
        />
      ))}
    </Box>
  );
}