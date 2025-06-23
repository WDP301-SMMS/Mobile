import api from "@/libs/hooks/axiosInstance";
import { UpdateStatus, UpdateStatusId } from "../types/consent";

export const manageConsent = {
  getConsent: () => api.get(`/vaccinationCampaigns/consents/my-requests`),
  getConsentById: (req: string) =>
    api.get(`/vaccinationCampaigns/consents/my-requests/${req}`),
  updateConsentStatus: (req: UpdateStatusId, body: UpdateStatus) =>
    api.patch(
      `/vaccinationCampaigns/consent/${req.campaignId}/students/${req.studentId}/respond`,
      body
    ),
};
