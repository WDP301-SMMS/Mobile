import api from "@/libs/hooks/axiosInstance";
import {
  Login,
  SignUp,
  forgotPassword,
  resetPassword,
  verifyOTP,
} from "@/libs/types/account";

export const manageAuthen = {
  login: (req: Login) => api.post(`/auth/login`, req),
  register: (req: SignUp) => api.post(`/auth/register`, req),
  forgotPassword: (req: forgotPassword) =>
    api.post(`/auth/forgot-password`, req),
  verifyOTP: (req: verifyOTP) => api.post(`/auth/verify-otp`, req),
  resetPassword: (req: resetPassword) => api.post(`/auth/reset-password`, req),
};
