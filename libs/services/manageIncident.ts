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
  //   getHealthProfile: (studentId: string) =>
  //     api.get(`/health-profiles/student/${studentId}`),
};
