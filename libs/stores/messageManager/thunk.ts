import { manageMessage } from "@/libs/services/manageMessage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAvailableUsers = createAsyncThunk(
  "message/available-user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageMessage.getAvailableUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
