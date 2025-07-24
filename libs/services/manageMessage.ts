import api from "@/libs/hooks/axiosInstance";

export const manageMessage = {
  getAvailableUsers: () => api.get(`/messages/available-users`),
};
