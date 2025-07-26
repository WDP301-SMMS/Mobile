import { manageHealthProfile } from "@/libs/services/manageHealthProfile";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getMyChild = createAsyncThunk(
  "students/my-students",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageHealthProfile.getMyChild();
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const claimStudent = createAsyncThunk(
  "students/claim",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageHealthProfile.claimStudent(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const studentHealthProfile = createAsyncThunk(
  "students/health-profile",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageHealthProfile.getHealthProfile(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const studentHealthHistory = createAsyncThunk(
  "students/health-history",
  async (
    { studentId, schoolYear }: { studentId: string; schoolYear: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageHealthProfile.getHealthHistory(
        studentId,
        schoolYear
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
