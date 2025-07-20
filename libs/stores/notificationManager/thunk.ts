import { manageNotification } from "@/libs/services/manageNotification";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerPushToken = createAsyncThunk(
  "push-tokens/register",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageNotification.registerPushToken(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const getNotifications = createAsyncThunk(
  "notifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageNotification.getNotifications();
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const unreadCount = createAsyncThunk(
  "unreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageNotification.unreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "markAsRead",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageNotification.markAsRead(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);

export const readAll = createAsyncThunk(
  "readAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageNotification.readAll();
      return response.data;
    } catch (error) {
      return rejectWithValue("Có lỗi");
    }
  }
);
