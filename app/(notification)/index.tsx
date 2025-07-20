import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNotification } from "@/libs/hooks/useNotification";
import { useAppDispatch } from "@/libs/stores";
import {
  getNotifications,
  markAsRead,
  readAll,
  unreadCount,
} from "@/libs/stores/notificationManager/thunk";
import { Notification } from "@/libs/types/notification";
import { getNotificationDisplayData } from "@/libs/utils/notification/displayData";

export default function NotificationScreen() {
  const dispatch = useAppDispatch();
  const {
    notifications: initialNotifications,
    loading,
    countUnread,
  } = useNotification();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (initialNotifications.length > 0 && notifications.length === 0) {
      setNotifications(initialNotifications);
    }
  }, [initialNotifications]);

  useEffect(() => {
    dispatch(getNotifications());
    dispatch(unreadCount());
  }, [dispatch]);

  const markAsReadNoti = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    dispatch(markAsRead(id));
    dispatch(unreadCount());
  };

  const markAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    dispatch(readAll());
    dispatch(unreadCount());
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "HEALTH_CHECK_CAMPAIGN_NEW":
      case "HEALTH_CHECK_RESULT_READY":
        return { name: "healing", color: "#28B463" };
      case "VACCINE_CAMPAIGN_NEW":
        return { name: "local-hospital", color: "#17A589" };
      case "MEDICATION_REQUEST_SCHEDULED":
      case "MEDICATION_REQUEST_COMPLETED":
      case "MEDICATION_REQUEST_REJECTED":
        return { name: "medication", color: "#CA6F1E" };
      case "MEETING_SCHEDULE_NEW":
      case "MEETING_SCHEDULE_UPDATED":
      case "MEETING_SCHEDULE_CANCELED":
        return { name: "event", color: "#5D6D7E" };
      case "MEDICAL_INCIDENT_PARENT_ALERT":
        return { name: "priority-high", color: "#E74C3C" };
      case "PARENT_SUBMITTED_CONSENT":
        return { name: "assignment-turned-in", color: "#1F618D" };
      case "NEW_MEDICATION_REQUEST_RECEIVED":
        return { name: "playlist-add-check", color: "#884EA0" };
      case "MEDICAL_INCIDENT_NEW":
        return { name: "report", color: "#E67E22" };
      case "INVENTORY_ITEM_LOW_STOCK":
        return { name: "inventory", color: "#BA4A00" };
      case "CHAT_MESSAGE_NEW":
        return { name: "chat", color: "#2E86C1" };
      default:
        return { name: "notifications", color: "#3498DB" };
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 pt-6">
      <View className="px-5 pb-10">
        {countUnread > 0 && (
          <TouchableOpacity
            onPress={markAll}
            className="bg-blue-600 py-3 rounded-xl mb-5 items-center flex-row justify-center space-x-2"
          >
            <MaterialIcons name="done-all" size={20} color="#fff" />
            <Text className="ml-2 text-white font-semibold text-base">
              Đánh dấu tất cả đã đọc
            </Text>
          </TouchableOpacity>
        )}

        {loading ? (
          <View className="items-center justify-center mt-20">
            <ActivityIndicator size="large" color="#3498DB" />
            <Text className="mt-3 text-gray-500 text-sm">
              Đang tải thông báo...
            </Text>
          </View>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => {
            const icon = getNotificationIcon(notif.type);
            const display = getNotificationDisplayData(notif);
            const date = new Date(notif.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <View
                key={notif._id}
                className={`rounded-2xl mb-4 border shadow-sm ${
                  notif.isRead
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-300"
                }`}
              >
                <View className="flex-row px-4 pt-4 pb-2">
                  <View className="relative w-12 h-12 rounded-full bg-white items-center justify-center border border-gray-300 mr-4 mt-1.5">
                    <MaterialIcons
                      name={icon.name as any}
                      size={30}
                      color={icon.color}
                    />
                    {!notif.isRead && (
                      <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </View>

                  <View className="flex-1 pr-2">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text
                        className={`text-base flex-1 ${
                          notif.isRead
                            ? "text-gray-700 font-normal"
                            : "text-blue-900 font-bold"
                        }`}
                      >
                        {display.title}
                      </Text>
                      <Text className="text-xs text-blue-700 font-semibold">
                        {date}
                      </Text>
                    </View>

                    <Text
                      className={`text-sm ${
                        notif.isRead ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {display.body}
                    </Text>
                  </View>
                </View>

                <View className="px-4 pb-4 pt-2">
                  {notif.isRead ? (
                    <View className="flex-row items-center justify-center bg-gray-200 py-2 rounded-xl space-x-2">
                      <MaterialIcons
                        name="check-circle"
                        size={18}
                        color="#4CAF50"
                      />
                      <Text className="ml-2 text-gray-700 font-medium text-sm">
                        Đã đọc
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => markAsReadNoti(notif._id)}
                      className="bg-blue-500 py-2 px-4 rounded-xl flex-row items-center justify-center space-x-2"
                    >
                      <MaterialIcons name="done" size={18} color="#fff" />
                      <Text className="ml-2 text-white font-semibold text-sm">
                        Đánh dấu đã đọc
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View className="bg-white p-8 rounded-2xl items-center justify-center mt-10 shadow-sm">
            <MaterialIcons name="inbox" size={60} color="#B0BEC5" />
            <Text className="text-gray-600 text-base mt-4 text-center">
              Bạn không có thông báo nào.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
