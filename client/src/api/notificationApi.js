import apiClient from "./axios";

export const getNotifications = async () => {
  const res = await apiClient.get(`/user/notification/`);
  return res.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const res = await apiClient.patch(`/user/notification/${notificationId}/markread`);
  return res.data;
};

export const sendNotification = async ({ recipient_id, message, complaint_id }) => {
  const payload = { recipient_id, message };
  if (complaint_id) payload.complaint_id = complaint_id; //optional 

  const res = await apiClient.post('/user/notification/send', payload);
  return res.data;
};