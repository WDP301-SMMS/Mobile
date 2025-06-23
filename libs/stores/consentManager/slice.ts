import { StudentConsentInfo } from "@/libs/types/consent";
import { createSlice } from "@reduxjs/toolkit";
import { getConsent, getConsentById, updateConsentStatus } from "./thunk";

type stateType = {
  loading: boolean;
  consents: StudentConsentInfo[];
  consentDetail: StudentConsentInfo | null;
};

const initialState: stateType = {
  loading: false,
  consents: [],
  consentDetail: null,
};

export const manageConsentSlice = createSlice({
  name: "manageConsent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConsent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConsent.fulfilled, (state, action) => {
        state.loading = false;
        state.consents = action.payload.data;
      })
      .addCase(getConsent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getConsentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConsentById.fulfilled, (state, action) => {
        state.loading = false;
        state.consentDetail = action.payload.data;
      })
      .addCase(getConsentById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateConsentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateConsentStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateConsentStatus.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageConsentReducer, actions: manageConsentActions } =
  manageConsentSlice;
