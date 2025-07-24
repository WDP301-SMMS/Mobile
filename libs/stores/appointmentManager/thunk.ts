import { manageAppointment } from "@/libs/services/manageAppointment";
import { Respond } from "@/libs/types/appointment";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllAppointment = createAsyncThunk(
  "appointment/all",
  async (
    query: {
      page?: number;
      limit?: number;
      status?: string;
      studentId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageAppointment.getAllAppointment(query);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getAppointmentDetail = createAsyncThunk(
  "appointment/detail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageAppointment.getAppointmentDetail(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const respondToAppointment = createAsyncThunk(
  "appointment/respond",
  async (
    {
      appointmentId,
      action,
      reason,
    }: {
      appointmentId: string;
      action: string;
      reason?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      if (!appointmentId) {
        return rejectWithValue("Missing appointmentId");
      }

      const body: Respond = {
        action,
        ...(reason && { reason }),
      };

      const response = await manageAppointment.respondToAppointment(
        appointmentId,
        body
      );
      return response.data;
    } catch (error: any) {
      console.error("Error:", error);
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);
