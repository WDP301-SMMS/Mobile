import { AvailableUser } from "@/libs/types/message";
import { createSlice } from "@reduxjs/toolkit";
import { getAvailableUsers } from "./thunk";

type stateType = {
  loading: boolean;
  availableUser?: AvailableUser[] | [];
};

const initialState: stateType = {
  loading: false,
  availableUser: [],
};

export const manageMessageSlice = createSlice({
  name: "manageMessage",
  initialState,
  reducers: {},
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
      });
  },
});

export const { reducer: manageMessageReducer, actions: manageMessageActions } =
  manageMessageSlice;
