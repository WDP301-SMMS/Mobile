import { manageRequest } from "@/libs/services/manageRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllRequest = createAsyncThunk(
  "request/all",
  async (
    query: {
      page?: number;
      limit?: number;
      status?: string;
      studentId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageRequest.getAllRequest(query);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getRequestDetail = createAsyncThunk(
  "request/detail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageRequest.getRequestDetail(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getRequestSchedule = createAsyncThunk(
  "request/schedule",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageRequest.getRequestSchedule(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
