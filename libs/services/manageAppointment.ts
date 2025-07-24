import api from "@/libs/hooks/axiosInstance";
import { Respond } from "../types/appointment";

export const manageAppointment = {
  getAllAppointment: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    studentId?: string;
  }) => {
    const { ...rest } = params || {};
    return api.get(`/appointments`, {
      params: rest,
    });
  },
  getAppointmentDetail: (req: string) => api.get(`/appointments/${req}`),
  respondToAppointment: (req: string, body: Respond) =>
    api.patch(`/appointments/${req}/respond`, body),
};
