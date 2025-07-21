import api from "@/libs/hooks/axiosInstance";

export const manageHealthProfile = {
  getMyChild: () => api.get(`/health-profiles/students/my-students`),
  claimStudent: (invitedCode: string) =>
    api.post(`/health-profiles/students/claim`, {
      invitedCode,
    }),
  getHealthProfile: (studentId: string) =>
    api.get(`/health-profiles/student/${studentId}`),
};
