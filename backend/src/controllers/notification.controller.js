import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import * as notificationService from '../services/notification.service.js';

/**
 * Controller to send a notification to another user.
 */
export const sendNotificationToUser = asyncHandler(async (req, res) => {
  const { recipient_id, message, complaint_id } = req.body;
  const sender_id = req.user?._id;

  if (!recipient_id || !message  || !sender_id) {
    throw new apiError(
      400,
      'Recipient ID, message, sender ID, and complaint title are required.'
    );
  }

  if (sender_id.toString() === recipient_id.toString()) {
    throw new apiError(400, 'You cannot send a notification to yourself.');
  }

  const notificationData = {
    sender_id,
    recipient_id,
    message,
    complaint_id: complaint_id || null, // complaint_id is optional
  };

  const notification =
    await notificationService.sendNotification(notificationData);

  return res
    .status(200)
    .json(
      new apiResponse(200, notification, 'Notification sent successfully.')
    );
});

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
// user id jo send karega, --- user id jisko send krna hai--- message ***
