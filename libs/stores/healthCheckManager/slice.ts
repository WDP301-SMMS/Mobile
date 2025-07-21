import { HealthCheckConsent } from "@/libs/types/healthCheck";
import { createSlice } from "@reduxjs/toolkit";
import {
    getHealthCheckConsent,
    getHealthCheckConsentDetail,
    updateConsent,
} from "./thunk";

type stateType = {
  loading: boolean;
  consents: HealthCheckConsent[];
  consentDetail: HealthCheckConsent | null;
};

const initialState: stateType = {
  loading: false,
  consents: [],
  consentDetail: null,
};

export const manageHealthCheckSlice = createSlice({
  name: "manageHealthCheck",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHealthCheckConsent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHealthCheckConsent.fulfilled, (state, action) => {
        state.loading = false;
        state.consents = action.payload.data;
      })
      .addCase(getHealthCheckConsent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getHealthCheckConsentDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHealthCheckConsentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.consentDetail = action.payload.data;
      })
      .addCase(getHealthCheckConsentDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateConsent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateConsent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateConsent.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageHealthCheckReducer,
  actions: manageHealthCheckActions,
} = manageHealthCheckSlice;
