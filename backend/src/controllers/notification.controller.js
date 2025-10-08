import * as notificationService from '../services/notification.service.js';

/**
 * Controller to get all notifications for the currently logged-in user.
 */
export const getNotificationsForUser = async (req, res) => {
  try {
    // req.user.id is populated by the auth middleware
    const userId = req.user.id;
    const notifications = await notificationService.getNotifications(userId);
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications.',
    });
  }
};

/**
 * Controller to mark a notification as read.
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const userId = req.user.id;

    const notification = await notificationService.markAsRead(
      notificationId,
      userId
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          'Notification not found or you do not have permission to read it.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read.',
    });
  }
};
