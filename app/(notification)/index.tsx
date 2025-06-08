import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'general' | 'health' | 'urgent';
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Lịch hẹn khám sức khỏe mới",
      message: "Con Nguyễn Văn A có lịch khám định kỳ vào 09:00 ngày 20/07/2025.",
      timestamp: "1 giờ trước",
      isRead: false,
      type: 'health',
    },
    {
      id: "2",
      title: "Kết quả tiêm chủng",
      message: "Con Trần Thị B đã hoàn thành mũi tiêm nhắc uốn ván.",
      timestamp: "3 giờ trước",
      isRead: false,
      type: 'health',
    },
    {
      id: "3",
      title: "Thông báo từ nhà trường",
      message: "Lịch nghỉ hè sẽ bắt đầu từ ngày 15/07/2025. Vui lòng xem chi tiết trên cổng thông tin.",
      timestamp: "1 ngày trước",
      isRead: true,
      type: 'general',
    },
    {
      id: "4",
      title: "Nhắc nhở nộp phiếu đồng ý",
      message: "Bạn có phiếu đồng ý khám tổng quát cho con Lê Minh C cần phản hồi trước ngày 07/06/2025.",
      timestamp: "2 ngày trước",
      isRead: false,
      type: 'urgent',
    },
    {
      id: "5",
      title: "Tin nhắn mới",
      message: "Bạn có tin nhắn từ giáo viên chủ nhiệm lớp 3A.",
      timestamp: "3 ngày trước",
      isRead: true,
      type: 'general',
    },
    {
      id: "6",
      title: "Cập nhật hồ sơ sức khỏe",
      message: "Hồ sơ sức khỏe của con Phạm Thị D đã được cập nhật thông tin về dị ứng.",
      timestamp: "4 ngày trước",
      isRead: true,
      type: 'health',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'health':
        return { name: "healing", color: "#28B463" };
      case 'urgent':
        return { name: "warning", color: "#E74C3C" };
      case 'general':
      default:
        return { name: "info-outline", color: "#3498DB" };
    }
  };

  return (
    <ScrollView className="flex-1 bg-white pt-4">

      <View className="px-6 pb-4 flex-row justify-end items-center border-b border-gray-100">
        {notifications.some(notif => !notif.isRead) && (
          <TouchableOpacity onPress={markAllAsRead} className="px-3 py-1 rounded-full bg-blue-100">
            <Text className="text-sm font-semibold text-blue-700">Đánh dấu tất cả đã đọc</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="px-6 py-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const icon = getNotificationIcon(notif.type);
            return (
              <TouchableOpacity
                key={notif.id}
                onPress={() => markAsRead(notif.id)}
                className={`flex-row items-start p-4 rounded-xl mb-3 shadow-sm border
                  ${notif.isRead ? "bg-gray-50 border-gray-200" : "bg-white border-secondary"}`}
              >
                <View className="mr-3 mt-1">
                  <MaterialIcons name={icon.name as any} size={24} color={icon.color} />
                  {!notif.isRead && (
                    <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </View>

                <View className="flex-1">
                  <Text className={`text-base ${notif.isRead ? "text-gray-700 font-normal" : "text-primary font-bold"}`}>
                    {notif.title}
                  </Text>
                  <Text className={`text-sm mt-1 ${notif.isRead ? "text-gray-500" : "text-gray-600"}`}>
                    {notif.message}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-2">
                    {notif.timestamp}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="bg-gray-50 p-4 rounded-lg items-center justify-center mt-4">
            <MaterialIcons name="inbox" size={40} color="#B0BEC5" />
            <Text className="text-gray-600 text-base mt-2 text-center">
              Bạn không có thông báo nào.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}