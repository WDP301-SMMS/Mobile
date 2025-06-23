import { manageAuthen } from "@/libs/services/manageAuthen";
import { Login, SignUp } from "@/libs/types/account";
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
      console.log(error)
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
