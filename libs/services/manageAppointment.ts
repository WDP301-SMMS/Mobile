import api from "@/libs/hooks/axiosInstance";

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
  //   getRequestDetail: (req: string) => api.get(`/medication/requests/${req}`),
};
