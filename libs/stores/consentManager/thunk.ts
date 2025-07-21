import { manageConsent } from "@/libs/services/manageConsent";
import { UpdateStatus, UpdateStatusId } from "@/libs/types/consent";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getConsent = createAsyncThunk(
  "consents/my-requests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageConsent.getConsent();
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getConsentById = createAsyncThunk(
  "consents/my-requests/:consentId",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageConsent.getConsentById(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const updateConsentStatus = createAsyncThunk(
  "consents/student/respond",
  async (
    {
      campaignId,
      studentId,
      status,
      reasonForDeclining,
    }: {
      campaignId: string;
      studentId: string;
      status: string;
      reasonForDeclining?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      if (!campaignId || !studentId) {
        return rejectWithValue("Missing campaignId or studentId");
      }

      const req: UpdateStatusId = {
        campaignId,
        studentId,
      };

      const body: UpdateStatus = {
        status,
        ...(reasonForDeclining && { reasonForDeclining }),
      };

      const response = await manageConsent.updateConsentStatus(req, body);
      return response.data;
    } catch (error: any) {
      console.error("Error:", error);
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);
