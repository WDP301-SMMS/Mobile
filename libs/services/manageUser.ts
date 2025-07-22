import api from "@/libs/hooks/axiosInstance";
import { ChangePassword, UpdateUser } from "@/libs/types/account";

export const manageUser = {
  getUser: () => api.get(`/user/me`),
  updateUser: (req: UpdateUser) => api.put(`/user/me`, req),
  changePassword: (req: ChangePassword) =>
    api.patch(`/user/me/change-password`, req),
};
