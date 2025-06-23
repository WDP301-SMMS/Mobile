import { manageUser } from "@/libs/services/manageUser";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk(
  "user/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageUser.getUser();
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
