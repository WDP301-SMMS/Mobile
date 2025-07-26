import { AvailableUser, Message, MessageRoom } from "@/libs/types/message";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createMessageRoom,
  getAllMessageRoom,
  getAvailableUsers,
  getMessageRoom,
  uploadImage,
} from "./thunk";

type StateType = {
  loading: boolean;
  availableUser: AvailableUser[];
  messageRoom: MessageRoom[];
  message: Message[];
};

const initialState: StateType = {
  loading: false,
  availableUser: [],
  messageRoom: [],
  message: [],
};

export const manageMessageSlice = createSlice({
  name: "manageMessage",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.message = [];
    },
    clearRooms: (state) => {
      state.messageRoom = [];
    },
    addMessageToLocal: (state, action: PayloadAction<Message>) => {
      state.message.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAvailableUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAvailableUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.availableUser = action.payload.data;
      })
      .addCase(getAvailableUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createMessageRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMessageRoom.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createMessageRoom.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAllMessageRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMessageRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.messageRoom = action.payload.data;
      })
      .addCase(getAllMessageRoom.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getMessageRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessageRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.data;
      })
      .addCase(getMessageRoom.rejected, (state) => {
        state.loading = false;
      })
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(uploadImage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageMessageReducer, actions: manageMessageActions } =
  manageMessageSlice;

export const { clearMessages, clearRooms, addMessageToLocal } =
  manageMessageActions;
