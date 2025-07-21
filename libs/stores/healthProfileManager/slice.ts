import { HealthProfile, Student } from "@/libs/types/healthProfile";
import { createSlice } from "@reduxjs/toolkit";
import { claimStudent, getMyChild, studentHealthProfile } from "./thunk";

type stateType = {
  loading: boolean;
  myChild: Student[] | [];
  healthProfile: HealthProfile | null;
};

const initialState: stateType = {
  loading: false,
  myChild: [],
  healthProfile: null,
};

export const manageHealthProfileSlice = createSlice({
  name: "manageHealthProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyChild.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyChild.fulfilled, (state, action) => {
        state.loading = false;
        state.myChild = action.payload.data;
      })
      .addCase(getMyChild.rejected, (state) => {
        state.loading = false;
      })
      .addCase(claimStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(claimStudent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(claimStudent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(studentHealthProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(studentHealthProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.healthProfile = action.payload.data;
      })
      .addCase(studentHealthProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageHealthProfileReducer,
  actions: manageHealthProfileActions,
} = manageHealthProfileSlice;
