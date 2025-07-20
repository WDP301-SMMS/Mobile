import { manageAuthen } from "@/libs/services/manageAuthen";
import {
  Login,
  SignUp,
  forgotPassword,
  resetPassword,
  verifyOTP,
} from "@/libs/types/account";
import { parseJwt } from "@/libs/utils/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

export const login = createAsyncThunk(
  "auth/login",
  async (req: Login, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.login(req);
      const token = response.data?.data.accessToken;

      const accountID = parseJwt(token);
      await SecureStore.setItemAsync("role", accountID.role);

      const allowedRoles = ["Parent"];
      if (!token || !allowedRoles.includes(accountID.role)) {
        await SecureStore.deleteItemAsync("role");
        return rejectWithValue("Bạn không có quyền truy cập vào ứng dụng này");
      }
      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("accountID", accountID._id);

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Email hoặc mật khẩu không đúng.");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (req: SignUp, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.register(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Đăng ký không thành công");
    }
  }
);

export const forgotPass = createAsyncThunk(
  "auth/forgot-Password",
  async (req: forgotPassword, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.forgotPassword(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Tạo OTP không thành công");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verify-otp",
  async (req: verifyOTP, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.verifyOTP(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Xác nhận OTP không thành công");
    }
  }
);

export const resetPass = createAsyncThunk(
  "auth/reset-password",
  async (req: resetPassword, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.resetPassword(req);
      return response.data;
    } catch (error) {
      return rejectWithValue("Reset mật khẩu không thành công");
    }
  }
);
