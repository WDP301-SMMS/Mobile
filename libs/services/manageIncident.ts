import api from "@/libs/hooks/axiosInstance";

export const manageIncident = {
  getAllIncident: (params?: {
    page?: number;
    limit?: number;
    severity?: string;
    studentId?: string;
  }) => {
    const { ...rest } = params || {};
    return api.get(`/incident`, {
      params: rest,
    });
  },
  getIncidentDetail: (req: string) => api.get(`/incident/${req}`),
};
