import Notification from '../models/notification.model.js';
import cron from 'node-cron';
import { apiError } from '../utils/apiError.js';


export const sendNotification = async (notificationData) => {
  const notification = new Notification(notificationData);
  const savedNotification = await notification.save();

  if (!savedNotification) {
    throw new apiError(500, 'Failed to save the notification in the database.');
  }

  console.log(
    `Notification sent from ${notificationData.sender_id} to ${notificationData.recipient_id}`
  );

  return savedNotification;
};


export const getNotifications = async (userId) => {
  return Notification.find({ recipient_id: userId }).sort({ createdAt: -1 });
};


export const markAsRead = async (notificationId, userId) => {
  const updatedNotification = Notification.findOneAndUpdate(
    { _id: notificationId, recipient_id: userId },
    { read_status: true },
    { new: true }
  );
  if (!updatedNotification) {
    throw new apiError(500, 'Unable to mark as read in database, server error');
  }
  return updatedNotification;
};

const deleteOldReadNotifications = async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const result = await Notification.deleteMany({
      read_status: true,
      updatedAt: { $lt: sevenDaysAgo },
    });

    if (result.deletedCount > 0) {
      console.log(
        `Cron job: Deleted ${result.deletedCount} old, read notifications.`
      );
    }
  } catch (error) {
    console.error(
      'Error in scheduled job for deleting old notifications:',
      error
    );
  }
};


export const scheduleCleanup = () => {

  cron.schedule(
    '0 2 * * *',
    () => {
      console.log('Running the daily cleanup job for old notifications...');
      deleteOldReadNotifications();
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );
};
