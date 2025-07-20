import { User } from "@/libs/types/account";
import { createSlice } from "@reduxjs/toolkit";
import { getUser, updateUser } from "./thunk";

type stateType = {
  loading: boolean;
  info: User | null;
};

const initialState: stateType = {
  loading: false,
  info: null,
};

export const manageUserSlice = createSlice({
  name: "manageUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload.data;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageUserReducer, actions: manageUserActions } =
  manageUserSlice;
