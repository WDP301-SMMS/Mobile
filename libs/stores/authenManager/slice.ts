import { createSlice } from "@reduxjs/toolkit";
import { forgotPass, login, register, resetPass, verifyOtp } from "./thunk";

type stateType = {
  loading: boolean;
};

const initialState: stateType = {
  loading: false,
};

export const manageAuthenSlice = createSlice({
  name: "manageAuthen",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
      })
      .addCase(forgotPass.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPass.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPass.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(resetPass.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPass.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPass.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageAuthenReducer, actions: manageAuthenActions } =
  manageAuthenSlice;
