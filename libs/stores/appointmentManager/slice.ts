import { HealthMeeting } from "@/libs/types/appointment";
import { createSlice } from "@reduxjs/toolkit";
import {
    getAllAppointment,
    getAppointmentDetail,
    respondToAppointment,
} from "./thunk";

type stateType = {
  loading: boolean;
  appointments: HealthMeeting[] | [];
  appointmentDetail: HealthMeeting | null;
  page: number;
  hasMore: boolean;
};

const initialState: stateType = {
  loading: false,
  appointments: [],
  appointmentDetail: null,
  page: 1,
  hasMore: true,
};

export const manageAppointmentSlice = createSlice({
  name: "manageAppointment",
  initialState,
  reducers: {
    resetAppointments(state) {
      state.appointments = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload?.data ?? [];
        const page = action.payload?.pagination.page ?? 1;
        state.page = page;
        if (page === 1) {
          state.appointments = newData;
        } else {
          state.appointments = [...state.appointments, ...newData];
        }
        state.hasMore = newData.length > 0;
      })
      .addCase(getAllAppointment.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAppointmentDetail.pending, (state) => {
        state.loading = false;
      })
      .addCase(getAppointmentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentDetail = action.payload?.data;
      })
      .addCase(getAppointmentDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(respondToAppointment.pending, (state) => {
        state.loading = false;
      })
      .addCase(respondToAppointment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(respondToAppointment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageAppointmentReducer,
  actions: { resetAppointments },
} = manageAppointmentSlice;
