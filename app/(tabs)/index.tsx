import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/libs/context/AuthContext";
import { useNotifications } from "@/libs/context/NotificationContext";
import { useNotification } from "@/libs/hooks/useNotification";
import { useAppDispatch } from "@/libs/stores";
import {
  getAttentionNotifications,
  registerPushToken,
  unreadCount,
} from "@/libs/stores/notificationManager/thunk";
import { getNotificationDisplayData } from "@/libs/utils/notification/displayData";
import { requestPermissionAndGetToken } from "@/libs/utils/notification/firebaseNotification";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const now = new Date();
  const weekday = now.toLocaleDateString("vi-VN", { weekday: "long" });
  const date = now.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { user } = useAuth();
  const { countUnread, attentionNotifications } = useNotification();
  const { hasNewNotification, hasNewMessage } = useNotifications();
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(unreadCount());
      dispatch(getAttentionNotifications());
    }, [dispatch])
  );

  useEffect(() => {
    if (hasNewNotification) {
      dispatch(unreadCount());
    }
  }, [hasNewNotification, dispatch]);

  useEffect(() => {
    async function setupPushNotifications() {
      try {
        const fcmToken = await requestPermissionAndGetToken();
        if (fcmToken) {
          dispatch(registerPushToken(fcmToken));
        }
      } catch (error) {
        console.error("Lỗi khi xin quyền thông báo tại HomeScreen:", error);
      }
    }

    setupPushNotifications();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white pt-10">
      <View className="flex-col justify-between gap-y-5 bg-primary px-6 pt-6 pb-4 border-b border-primary/10">
        <View className="flex-row items-center justify-between">
          <Link href={"/(tabs)/info"} asChild>
            <TouchableOpacity className="flex-row items-center space-x-4">
              <UserAvatar username={user?.username ?? ""} />
              <Text className="text-xl font-bold text-white ml-2">
                {user?.username}
              </Text>
            </TouchableOpacity>
          </Link>
          <View className="flex-row gap-x-4">
            <Link href={"/(notification)"} asChild>
              <TouchableOpacity className="p-2 rounded-full bg-tertiary">
                <View className="relative">
                  <MaterialIcons
                    name="notifications-none"
                    size={24}
                    color="#2260FF"
                  />
                  {countUnread > 0 && (
                    <View className="absolute -top-3 -right-2 bg-red-500 min-w-[18px] h-[18px] px-1 rounded-full items-center justify-center">
                      <Text className="text-white text-[10px] font-bold">
                        {countUnread > 99 ? "99+" : countUnread}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Link>
            <Link href={"/(chat)"} asChild>
              <TouchableOpacity className="p-2 rounded-full bg-tertiary">
                <View className="relative">
                  <MaterialIcons
                    name="chat-bubble-outline"
                    size={24}
                    color="#2260FF"
                  />
                  {hasNewMessage && (
                    <View className="absolute -top-3 -right-2 bg-red-500 w-[12px] h-[12px] rounded-full" />
                  )}
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        <View className="flex items-end">
          <Text className="text-sm font-semibold text-tertiary capitalize">
            {weekday}, {date}
          </Text>
        </View>
      </View>

      <View className="mb-8 px-6 pt-6">
        <View className="flex-row items-center mb-5">
          <MaterialIcons
            name="notifications-on"
            size={28}
            color="#EFBF04"
            className="mr-2"
          />
          <Text className="text-2xl font-bold text-primary">
            Việc cần chú ý
          </Text>
        </View>

        {attentionNotifications.length > 0 && (
          <View className="mt-6">
            {attentionNotifications.map((noti) => {
              const display = getNotificationDisplayData(noti);
              return (
                <View
                  key={noti._id}
                  className="flex-row items-center rounded-2xl p-4 mb-4 bg-sky-50 shadow-sm"
                >
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {display.title}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {display.body}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Link href={"/(tabs)/form"} asChild>
          <TouchableOpacity className="mt-2 self-start flex-row items-center p-2 rounded-lg">
            <Text className="text-secondary text-base font-semibold mr-1">
              Xem tất cả đơn từ & kết quả
            </Text>
            <MaterialIcons name="arrow-right-alt" size={24} color={"#22CEFF"} />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mb-12 px-6 pb-20">
        <View className="flex-row items-center mb-5">
          <MaterialIcons
            name="auto-awesome"
            size={28}
            color="#EFBF04"
            className="mr-2"
          />
          <Text className="text-2xl font-bold text-primary">Khám phá</Text>
        </View>

        <Link href={"/(tabs)/child"} asChild>
          <TouchableOpacity className="bg-tertiary p-5 rounded-2xl flex-row items-center justify-between mb-4 shadow-md">
            <Image
              source={require("@/assets/icons/children.png")}
              className="w-20 h-20 mr-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-primary font-bold text-lg mb-1">
                Hồ sơ sức khỏe của con
              </Text>
              <Text className="text-gray-600 text-sm mb-3">
                Xem lịch sử khám, tiêm chủng và thông tin chi tiết từng học
                sinh.
              </Text>
              <View className="bg-primary px-4 py-2 rounded-lg self-start flex-row items-center">
                <Text className="text-white font-semibold text-sm mr-2">
                  Đi đến Con tôi
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href={"/(tabs)/info"} asChild>
          <TouchableOpacity className="bg-tertiary p-5 rounded-2xl flex-row items-center justify-between shadow-md">
            <Image
              source={require("@/assets/icons/setting.png")}
              className="w-20 h-20 mr-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-primary font-bold text-lg mb-1">
                Quản lý tài khoản
              </Text>
              <Text className="text-gray-600 text-sm mb-3">
                Cập nhật thông tin cá nhân, cài đặt và tùy chỉnh ứng dụng.
              </Text>
              <View className="bg-primary px-4 py-2 rounded-lg self-start flex-row items-center">
                <Text className="text-white font-semibold text-sm mr-2">
                  Cá nhân
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
