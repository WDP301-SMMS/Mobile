import api from "@/libs/hooks/axiosInstance";

export const manageUser = {
  getUser: () => api.get(`/user/me`),
};
