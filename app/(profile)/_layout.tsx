import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function StackLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#2260FF",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Thông tin cá nhân",
          headerRight: () => (
            <TouchableOpacity
              onPressOut={() => {
                router.push("/(profile)/edit");
              }}
            >
              <MaterialIcons
                name="edit"
                size={24}
                color="#fff"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Thông tin cá nhân",
        }}
      />
    </Stack>
  );
}
