import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import * as notificationService from '../services/notification.service.js';

/**
 * Controller to get all notifications for the currently logged-in user.
 */
export const getNotificationsForUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const notifications = await notificationService.getNotifications(userId);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        notifications,
        'Notifications retrieved successfully'
      )
    );
});

/**
 * Controller for Admins to get all notifications for a specific user by their ID.
 */
export const getNotificationsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new apiError(400, "User ID is required");
    }

    const notifications = await notificationService.getNotifications(userId);

    return res
        .status(200)
        .json(new apiResponse(200, notifications, `Notifications for user ${userId} retrieved successfully`));
});

/**
 * Controller to mark a notification as read.
 */
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id: notificationId } = req.params;
  const userId = req.user?._id;

  const notification = await notificationService.markAsRead(
    notificationId,
    userId
  );

  if (!notification) {
    throw new apiError(404, 'Notification not found or access denied');
  }

  return res
    .status(200)
    .json(new apiResponse(200, notification, 'Notification marked as read'));
});
