import { MedicationRequest, MedicationSchedule } from "@/libs/types/request";
import { createSlice } from "@reduxjs/toolkit";
import { getAllRequest, getRequestDetail, getRequestSchedule } from "./thunk";

type stateType = {
  loading: boolean;
  requests: MedicationRequest[] | [];
  requestDetail: MedicationRequest | null;
  requestSchedule: MedicationSchedule[] | null;
  page: number;
  hasMore: boolean;
};

const initialState: stateType = {
  loading: false,
  requests: [],
  requestDetail: null,
  requestSchedule: [],
  page: 1,
  hasMore: true,
};

export const manageRequestSlice = createSlice({
  name: "manageRequest",
  initialState,
  reducers: {
    resetRequests(state) {
      state.requests = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRequest.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload?.data ?? [];
        const page = action.payload?.pagination.page ?? 1;
        state.page = page;
        if (page === 1) {
          state.requests = newData;
        } else {
          state.requests = [...state.requests, ...newData];
        }
        state.hasMore = newData.length > 0;
      })
      .addCase(getAllRequest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getRequestDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.requestDetail = action.payload.data;
      })
      .addCase(getRequestDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getRequestSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequestSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.requestSchedule = action.payload.data;
      })
      .addCase(getRequestSchedule.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageRequestReducer,
  actions: { resetRequests },
} = manageRequestSlice;
