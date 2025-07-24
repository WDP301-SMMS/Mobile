import api from "@/libs/hooks/axiosInstance";
import { getUser } from "@/libs/stores/userManager/thunk";
import { router, usePathname } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAppDispatch } from "../stores";

type AuthContextType = {
  user: any;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  signin: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoggedIn: false,
  loading: true,
  signin: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const checkLoginStatus = useCallback(async () => {
    setLoading(true);
    const storedToken = await SecureStore.getItemAsync("authToken");
    // console.log("Stored token:", storedToken);
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      const res = await dispatch(getUser()).unwrap();
      setUser(res.data);
      setToken(storedToken);
      setIsLoggedIn(true);
    } catch (err) {
      await SecureStore.deleteItemAsync("authToken");
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    checkLoginStatus();
  }, [pathname, checkLoginStatus]);

  const signin = async (newToken: string) => {
    setLoading(true);
    await SecureStore.setItemAsync("authToken", newToken);

    try {
      const res = await dispatch(getUser()).unwrap();
      setUser(res.data);
      setToken(newToken);
      setIsLoggedIn(true);
      router.replace("/(tabs)");
    } catch (err) {
      await SecureStore.deleteItemAsync("authToken");
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout error", err);
    } finally {
      await SecureStore.deleteItemAsync("authToken");
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      router.replace("/(auth)/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, loading, signin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
