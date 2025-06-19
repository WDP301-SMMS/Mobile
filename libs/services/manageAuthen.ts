import api from "@/libs/hooks/axiosInstance";
import { Login, SignUp } from "@/libs/types/account";

export const manageAuthen = {
  login: (req: Login) => api.post(`/auth/login`, req),
  register: (req: SignUp) => api.post(`/auth/register`, req),
};
