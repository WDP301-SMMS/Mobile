import ReduxProvider from "@/app/provider";
import { AuthProvider } from "@/libs/context/AuthContext";
import { NotificationProvider } from "@/libs/context/NotificationContext";
import { listenToForegroundMessages } from "@/libs/utils/notification/firebaseNotification";
import { createNotificationChannel } from "@/libs/utils/notification/initNotificationChannel";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat: require("@/assets/fonts/Montserrat-Regular.ttf"),
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    createNotificationChannel();
    listenToForegroundMessages();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <ReduxProvider>
        <NotificationProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(consent)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(medical-results)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(schedule)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(vaccination-history)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(health-profile)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(profile)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(notification)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </AuthProvider>
        </NotificationProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
