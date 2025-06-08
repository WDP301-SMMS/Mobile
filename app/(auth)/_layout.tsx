import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Trang chờ" }} />
      <Stack.Screen name="signin" options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="signup" options={{ title: "Đăng ký" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Quên mật khẩu" }}
      />
    </Stack>
  );
}
