import { sendNotification } from "../src/api/notificationApi.js";


export async function triggerNotification({ recipient_id, message, complaint_id }) {
  if (!recipient_id || !message) {
    console.warn('Missing required fields in triggerNotification');
    return;
  }

  try {
    const response = await sendNotification({ recipient_id, message, complaint_id });

    console.debug('Notification sent:', response);
    return response;
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}