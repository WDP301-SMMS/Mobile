import { manageIncident } from "@/libs/services/manageIncident";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllIncident = createAsyncThunk(
  "incident/all",
  async (
    query: {
      page?: number;
      limit?: number;
      severity?: string;
      studentId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageIncident.getAllIncident(query);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getIncidentDetail = createAsyncThunk(
  "incident/detail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageIncident.getIncidentDetail(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
