import { MedicalIncident } from "@/libs/types/incident";
import { createSlice } from "@reduxjs/toolkit";
import { getAllIncident, getIncidentDetail } from "./thunk";

type stateType = {
  loading: boolean;
  incidents: MedicalIncident[] | [];
  incidentDetail: MedicalIncident | null;
  page: number;
  hasMore: boolean;
};

const initialState: stateType = {
  loading: false,
  incidents: [],
  incidentDetail: null,
  page: 1,
  hasMore: true,
};

export const manageIncidentSlice = createSlice({
  name: "manageIncident",
  initialState,
  reducers: {
    resetIncidents(state) {
      state.incidents = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllIncident.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllIncident.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload?.data ?? [];
        const page = action.payload?.page ?? 1;
        state.page = page;
        if (page === 1) {
          state.incidents = newData;
        } else {
          state.incidents = [...state.incidents, ...newData];
        }
        state.hasMore = newData.length > 0;
      })
      .addCase(getAllIncident.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getIncidentDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIncidentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.incidentDetail = action.payload.data;
      })
      .addCase(getIncidentDetail.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageIncidentReducer,
  actions: { resetIncidents },
} = manageIncidentSlice;
