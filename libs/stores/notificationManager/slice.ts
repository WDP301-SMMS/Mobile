import { Notification } from "@/libs/types/notification";
import { createSlice } from "@reduxjs/toolkit";
import {
    getNotifications,
    registerPushToken,
    unreadCount
} from "./thunk";

type stateType = {
  loading: boolean;
  notifications?: Notification[] | [];
  countUnread: number;
};

const initialState: stateType = {
  loading: false,
  notifications: [],
  countUnread: 0,
};

export const manageNotificationSlice = createSlice({
  name: "manageNotification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerPushToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerPushToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerPushToken.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
      })
      .addCase(getNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(unreadCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(unreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.countUnread = action.payload.data.count;
      })
      .addCase(unreadCount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageNotificationReducer,
  actions: manageNotificationActions,
} = manageNotificationSlice;
