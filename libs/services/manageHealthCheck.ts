import api from "@/libs/hooks/axiosInstance";
import { UpdateConsent } from "@/libs/types/healthCheck";

export const manageHealthCheck = {
  getHealtchCheckConsent: () => api.get(`/health-check/consents`),
  getHealtchCheckConsentById: (req: string) =>
    api.get(`/health-check/consents/${req}`),
  updateConsentStatus: (req: string, body: UpdateConsent) =>
    api.patch(`/health-check/consents/${req}/status`, body),
};
