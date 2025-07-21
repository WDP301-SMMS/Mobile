import { manageHealthCheck } from "@/libs/services/manageHealthCheck";
import { UpdateConsent } from "@/libs/types/healthCheck";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getHealthCheckConsent = createAsyncThunk(
  "healthCheck/consent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageHealthCheck.getHealtchCheckConsent();
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getHealthCheckConsentDetail = createAsyncThunk(
  "healthCheck/consentDetail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageHealthCheck.getHealtchCheckConsentById(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const updateConsent = createAsyncThunk(
  "healthCheck/consentUpdate",
  async (
    { id, body }: { id: string; body: UpdateConsent },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageHealthCheck.updateConsentStatus(id, body);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
