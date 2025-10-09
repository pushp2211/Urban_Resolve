import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';

export default function NotificationItem({ notification, onMarkAsRead }) {
  const { message, createdAt, read, complaint_id } = notification;

  const formattedDate = createdAt
    ? format(new Date(createdAt), 'PPpp')
    : 'Unknown date';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 5,
        bgcolor: read ? 'background.paper' : 'action.hover',
        border: '1px solid',
        borderColor: 'divider',
        mb: 1,
        gap: 2,
        flexDirection:{
          xs:"column",
          sm:"column",
          md:"row"
        }
      }}
    >
      {/* Left side: message + meta info */}
      <Box sx={{ display: 'flex', alignItems: "flex-start", gap: 2, flexGrow: 1, flexDirection:"column" }}>
        {complaint_id && (
          <Chip
            label="Complaint"
            color="primary"
            size="small"
            sx={{ fontWeight: 500, minWidth:"5rem" }}
          />
          
        )}
        {!complaint_id && (
          <Chip
            label="Admin"
            color="primary"
            size="small"
            sx={{ fontWeight: 500, minWidth:"5rem" }}
          />
          
        )}

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: read ? 'normal' : 'bold',
              mb: 0.3,
            }}
          >
            {message}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {formattedDate}
          </Typography>
        </Box>
      </Box>

      {/* Right side: Mark-as-read button */}
      <Box
        sx={{
          alignSelf:"flex-end"
        }}
      >
        {(
          <Button
            variant="outlined"
            size="small"
            onClick={(e)=>onMarkAsRead(notification)}
            disabled = {notification.read_status}
          >
            Mark Read
          </Button>
        )}
      </Box>
    </Box>
  );
}