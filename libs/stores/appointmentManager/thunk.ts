import { manageAppointment } from "@/libs/services/manageAppointment";
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

// export const getRequestDetail = createAsyncThunk(
//   "request/detail",
//   async (req: string, { rejectWithValue }) => {
//     try {
//       const response = await manageRequest.getRequestDetail(req);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue("Có lỗi");
//     }
//   }
// );
