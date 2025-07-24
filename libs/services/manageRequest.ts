import api from "@/libs/hooks/axiosInstance";

export const manageRequest = {
  getAllRequest: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    studentId?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const { ...rest } = params || {};
    return api.get(`/medication/requests/parent`, {
      params: rest,
    });
  },
  getRequestDetail: (req: string) => api.get(`/medication/requests/${req}`),
  getRequestSchedule: (req: string) =>
    api.get(`/medication/schedules/request/${req}`),
};
