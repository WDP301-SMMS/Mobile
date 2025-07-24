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

// export const studentHealthProfile = createAsyncThunk(
//   "students/health-profile",
//   async (req: string, { rejectWithValue }) => {
//     try {
//       const response = await manageHealthProfile.getHealthProfile(req);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue("Có lỗi");
//     }
//   }
// );
