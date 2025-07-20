import { manageUser } from "@/libs/services/manageUser";
import { UpdateUser } from "@/libs/types/account";
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

export const updateUser = createAsyncThunk(
  "updateUser/me",
  async (req: UpdateUser, { rejectWithValue }) => {
    try {
      const response = await manageUser.updateUser(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
