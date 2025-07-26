import axios, { AxiosError, AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthContext {
  setUser: (user: any) => void;
  router: {
    push: (path: string) => void;
  };
}

let authContext: AuthContext | null = null;

export const setAuthContext = (context: AuthContext) => {
  authContext = context;
};

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor: Gắn token vào header
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor: Xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
