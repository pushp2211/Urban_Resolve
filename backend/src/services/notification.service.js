import Notification from '../models/notification.model.js';
import cron from 'node-cron'; // Import node-cron here

/**
 * Creates and saves a new notification.
 * @param {Object} notificationData - The data for the notification.
 * @returns {Promise<Document>} The created notification document.
 */
export const sendNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    console.log(`Notification sent to ${notificationData.recipient_id}`);
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Retrieves all notifications for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Document>>} A list of notifications.
 */
export const getNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({
      recipient_id: userId,
    }).sort({ createdAt: -1 });
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

/**
 * Marks a specific notification as read.
 * @param {string} notificationId - The ID of the notification.
 * @param {string} userId - The ID of the user requesting the action.
 * @returns {Promise<Document|null>} The updated notification document.
 */
export const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient_id: userId },
      { read_status: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Deletes notifications that were read more than 7 days ago.
 */
export const deleteOldReadNotifications = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await Notification.deleteMany({
      read_status: true,
      updatedAt: { $lt: sevenDaysAgo },
    });

    console.log(
      `Cron job: Deleted ${result.deletedCount} old, read notifications.`
    );
  } catch (error) {
    console.error(
      'Error in scheduled job for deleting old notifications:',
      error
    );
  }
};

/**
 * Schedules a job to delete old, read notifications daily.
 */
export const scheduleCleanup = () => {
  // Runs at 2:00 AM every day.
  cron.schedule(
    '0 2 * * *',
    () => {
      console.log('Running the daily cleanup job for old notifications...');
      // Calls the function from within the same file
      deleteOldReadNotifications();
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );
};
