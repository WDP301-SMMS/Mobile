import api from "@/libs/hooks/axiosInstance";
import { UpdateUser } from "@/libs/types/account";

export const manageUser = {
  getUser: () => api.get(`/user/me`),
  updateUser: (req: UpdateUser) => api.put(`/user/me`, req),
};
