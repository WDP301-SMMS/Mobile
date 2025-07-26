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

export const createMessageRoom = createAsyncThunk(
  "message/createRoom",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageMessage.createMessageRoom(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getAllMessageRoom = createAsyncThunk(
  "message/allRoom",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageMessage.getAllMessageRoom(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getMessageRoom = createAsyncThunk(
  "message/room",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageMessage.getMessageRoom(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const uploadImage = createAsyncThunk(
  "message/image",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await manageMessage.uploadImage(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
