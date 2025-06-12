import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface FullConversation {
  id: string;
  withUser: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  messages: Message[];
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const allConversations: FullConversation[] = [
    {
      id: "conv1",
      withUser: {
        id: "staff1",
        name: "Y tá Thu Phương",
        avatar: "https://i.pravatar.cc/150?img=60",
        role: "Y tá",
      },
      messages: [
        {
          id: "msg1",
          senderId: "parent_user",
          text: "Chào y tá, bé A hôm nay có khỏe không ạ?",
          timestamp: "10:00 AM",
        },
        {
          id: "msg2",
          senderId: "staff1",
          text: "Chào chị, bé A khỏe ạ. Đã uống thuốc đúng giờ sáng nay.",
          timestamp: "10:05 AM",
        },
        {
          id: "msg3",
          senderId: "parent_user",
          text: "Dạ vâng, cảm ơn y tá!",
          timestamp: "10:10 AM",
        },
        {
          id: "msg4",
          senderId: "staff1",
          text: "Không có gì ạ. Nếu có bất kỳ thay đổi nào tôi sẽ thông báo cho chị.",
          timestamp: "10:30 AM",
        },
        {
          id: "msg5",
          senderId: "parent_user",
          text: "Dạ tốt quá. Cảm ơn y tá nhé.",
          timestamp: "1:00 PM",
        },
        {
          id: "msg6",
          senderId: "staff1",
          text: "Cháu A đã uống thuốc đúng giờ sáng nay ạ.",
          timestamp: "1:20 PM",
        },
      ],
    },
    {
      id: "conv2",
      withUser: {
        id: "staff2",
        name: "Y tá Minh Anh",
        avatar: "https://i.pravatar.cc/150?img=58",
        role: "Y tá",
      },
      messages: [
        {
          id: "msg7",
          senderId: "parent_user",
          text: "Chào y tá, tình hình tiêm chủng bé B thế nào rồi ạ?",
          timestamp: "Hôm qua 3:00 PM",
        },
        {
          id: "msg8",
          senderId: "staff2",
          text: "Vâng, tôi sẽ kiểm tra lại hồ sơ tiêm chủng của bé B và phản hồi chị sớm nhất.",
          timestamp: "Hôm qua 3:05 PM",
        },
      ],
    },
  ];

  const [currentConversation, setCurrentConversation] =
    useState<FullConversation | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const currentUserId = "parent_user";

  useEffect(() => {
    if (id) {
      const foundConv = allConversations.find((conv) => conv.id === id);
      setCurrentConversation(foundConv || null);
    }
  }, [id]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [currentConversation?.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !currentConversation) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung tin nhắn.");
      return;
    }

    const newMsg: Message = {
      id: `msg${currentConversation.messages.length + 1}`,
      senderId: currentUserId,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setCurrentConversation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMsg],
      };
    });
    setNewMessage("");
  };

  if (!currentConversation) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <MaterialIcons name="error-outline" size={50} color="#EF4444" />
        <Text className="mt-4 text-xl font-semibold text-danger text-center">
          Không tìm thấy cuộc trò chuyện.
        </Text>
        <Text className="mt-2 text-gray-600 text-center">
          Vui lòng thử lại hoặc quay lại trang trước.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <Stack.Screen
        options={{
          title: currentConversation.withUser.name,
        }}
      />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {currentConversation.messages.map((message) => (
          <View
            key={message.id}
            className={`flex-row items-end mb-3 ${
              message.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {message.senderId !== currentUserId && (
              <Image
                source={{ uri: currentConversation.withUser.avatar }}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <View
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === currentUserId
                  ? "bg-primary rounded-br-none"
                  : "bg-gray-200 rounded-bl-none"
              }`}
            >
              <Text
                className={`${
                  message.senderId === currentUserId
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {message.text}
              </Text>
              <Text
                className={`text-right text-xs mt-1 ${
                  message.senderId === currentUserId
                    ? "text-blue-200"
                    : "text-gray-500"
                }`}
              >
                {message.timestamp}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center p-4 border-t border-gray-200 bg-white">
        <TextInput
          className="flex-1 p-3 border border-gray-300 rounded-2xl mr-3 text-base"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChangeText={setNewMessage}
          numberOfLines={3}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          className="bg-primary p-3 rounded-full flex justify-center items-center"
        >
          <MaterialIcons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
