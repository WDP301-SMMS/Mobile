import api from "@/libs/hooks/axiosInstance";

export const manageNotification = {
  registerPushToken: (token: string) =>
    api.post(`/token-notifications/push-tokens/register`, { token }),
  getNotifications: () => api.get(`/notifications`),
  getAttentionNotifications: () => api.get(`/notifications/attention`),
  unreadCount: () => api.get(`/notifications/unread-count`),
  markAsRead: (req: string) => api.patch(`/notifications/${req}/read`),
  readAll: () => api.patch(`/notifications/read-all`),
};
