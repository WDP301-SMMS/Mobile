import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#0288d1",
        },
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Đơn & Kết quả" }} />
    </Stack>
  );
}
