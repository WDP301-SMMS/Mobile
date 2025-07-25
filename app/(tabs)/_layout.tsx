import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2260FF",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            bottom: 15,
            left: 10,
            right: 10,
            borderRadius: 30,
            elevation: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            marginHorizontal: 20,
          },
          default: {
            position: "absolute",
            bottom: 15,
            left: 10,
            right: 10,
            borderRadius: 30,
            elevation: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            marginHorizontal: 20,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="form"
        options={{
          headerStyle: {
            backgroundColor: "#2260FF",
          },
          headerTintColor: "#fff",
          headerShown: true,
          headerTitle: "Sức khỏe",
          headerTitleAlign: "center",
          title: "Sức khỏe",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="health-and-safety" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="child"
        options={{
          headerStyle: {
            backgroundColor: "#2260FF",
          },
          headerTintColor: "#fff",
          headerShown: true,
          headerTitle: "Con của tôi",
          headerTitleAlign: "center",
          title: "Con của tôi",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="accessibility" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          headerStyle: {
            backgroundColor: "#2260FF",
          },
          headerTintColor: "#fff",
          headerShown: true,
          headerTitle: "Cá nhân",
          headerTitleAlign: "center",
          title: "Cá nhân",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
