import {
  Box,
  Typography,
  Chip,
  Button,
  useTheme,
} from "@mui/material";
import {
  format,
  formatDistanceToNow,
} from "date-fns";

import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

export default function NotificationItem({
  notification,
  onMarkAsRead,
  openComplaintModal,
}) {
  const theme = useTheme();

  const {
    message,
    createdAt,
    complaint_id,
  } = notification;

  // Change this if your backend uses "read" instead of "read_status"
  const isRead = notification.read_status;

  const relativeTime = createdAt
    ? formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
      })
    : "Unknown";

  const exactDate = createdAt
    ? format(new Date(createdAt), "MMM d, yyyy • h:mm a")
    : "";

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        flexDirection: {
          xs: "column",
          md: "row",
        },

        gap: 2,

        p: 3,
        mb: 2,

        borderRadius: 4,

        bgcolor:
          theme.palette.mode === "dark"
            ? isRead
              ? "#1d1d1d"
              : "rgba(25,118,210,.08)"
            : isRead
            ? "#ffffff"
            : "rgba(25,118,210,.04)",

        border: "1px solid",
        borderColor: "divider",

        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 24px rgba(0,0,0,.45)"
            : "0 6px 18px rgba(0,0,0,.08)",

        transition: ".25s ease",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 14px 35px rgba(0,0,0,.6)"
              : "0 12px 28px rgba(0,0,0,.12)",
        },
      }}
    >
      {/* Left unread indicator */}
      {!isRead && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: "primary.main",
          }}
        />
      )}

      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
        }}
      >
        {/* Chips */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            mb: 1.2,
          }}
        >
          <Chip
            icon={
              complaint_id ? (
                <AssignmentRoundedIcon />
              ) : (
                <CampaignRoundedIcon />
              )
            }
            label={complaint_id ? "Complaint" : "Admin"}
            color="primary"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
            }}
          />

          {!isRead && (
            <Chip
              label="NEW"
              color="success"
              size="small"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
              }}
            />
          )}
        </Box>

        {/* Message */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: isRead ? 500 : 700,
            lineHeight: 1.6,
            color: "text.primary",
            mb: 1,
          }}
        >
          {message}
        </Typography>

        {/* Time */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.7,
            alignItems: "center",
            fontSize: ".82rem",
          }}
        >
          <span>{relativeTime}</span>
          <span>•</span>
          <span>{exactDate}</span>
        </Typography>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          width: {
            xs: "100%",
            md: "auto",
          },
          justifyContent: "flex-end",

          "& .MuiButton-root": {
            flex: {
              xs: 1,
              md: "unset",
            },
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            minWidth: 135,
          },
        }}
      >
        {complaint_id && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<VisibilityRoundedIcon />}
            onClick={() => openComplaintModal(complaint_id)}
          >
            View Details
          </Button>
        )}

        <Button
          variant="outlined"
          color={isRead ? "inherit" : "success"}
          startIcon={<DoneRoundedIcon />}
          onClick={() => onMarkAsRead(notification)}
          disabled={isRead}
        >
          {isRead ? "Read" : "Mark Read"}
        </Button>
      </Box>
    </Box>
  );
}