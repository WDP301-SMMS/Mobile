import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Conversation {
  id: string;
  withUser: {
    name: string;
    avatar: string;
    role: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function ChatScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv1",
      withUser: {
        name: "Y tá Thu Phương",
        avatar: "https://i.pravatar.cc/150?img=60",
        role: "Y tá",
      },
      lastMessage: "Cháu A đã uống thuốc đúng giờ sáng nay ạ.",
      lastMessageTime: "10:30 AM",
      unreadCount: 1,
    },
    {
      id: "conv2",
      withUser: {
        name: "Y tá Minh Anh",
        avatar: "https://i.pravatar.cc/150?img=58",
        role: "Y tá",
      },
      lastMessage: "Vâng, tôi sẽ kiểm tra lại hồ sơ tiêm chủng của bé B.",
      lastMessageTime: "Hôm qua",
      unreadCount: 0,
    },
    {
      id: "conv4",
      withUser: {
        name: "Y tá Quỳnh Chi",
        avatar: "https://i.pravatar.cc/150?img=57",
        role: "Y tá",
      },
      lastMessage: "Chào chị, tôi đã nhận được phiếu đồng ý của bé D.",
      lastMessageTime: "Thứ 2",
      unreadCount: 0,
    },
  ]);

  return (
    <ScrollView className="flex-1 bg-white pt-4">
      <View className="px-6 py-4">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/(chat)/chat-room/${conv.id}`}
              asChild
            >
              <TouchableOpacity
                className={`flex-row items-center p-4 rounded-xl mb-3 shadow-sm border
                  ${
                    conv.unreadCount > 0
                      ? "bg-white border-secondary"
                      : "bg-gray-50 border-gray-200"
                  }`}
              >
                <View className="relative mr-4">
                  <Image
                    source={{ uri: conv.withUser.avatar }}
                    className="w-16 h-16 rounded-full border-2 border-gray-300"
                    resizeMode="cover"
                  />
                  {conv.unreadCount > 0 && (
                    <View className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 items-center justify-center border-2 border-white">
                      <Text className="text-white text-xs font-bold">
                        {conv.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text
                      className="text-lg font-bold text-primary flex-1 pr-2"
                      numberOfLines={1}
                    >
                      {conv.withUser.name} ({conv.withUser.role})
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {conv.lastMessageTime}
                    </Text>
                  </View>
                  <Text
                    className={`text-base ${
                      conv.unreadCount > 0
                        ? "text-gray-800 font-semibold"
                        : "text-gray-600"
                    }`}
                    numberOfLines={1}
                  >
                    {conv.lastMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        ) : (
          <View className="bg-gray-50 p-4 rounded-lg items-center justify-center mt-4">
            <MaterialIcons name="forum" size={40} color="#B0BEC5" />
            <Text className="text-gray-600 text-base mt-2 text-center">
              Bạn chưa có cuộc trò chuyện nào.
            </Text>
            <TouchableOpacity className="mt-4 bg-primary px-4 py-2 rounded-lg">
              <Text className="text-white font-semibold">
                Bắt đầu trò chuyện mới
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
