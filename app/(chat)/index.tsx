import { useAuth } from "@/libs/context/AuthContext";
import { useMessage } from "@/libs/hooks/useMessage";
import { useAppDispatch } from "@/libs/stores";
import {
  createMessageRoom,
  getAllMessageRoom,
  getAvailableUsers,
} from "@/libs/stores/messageManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const dispatch = useAppDispatch();
  const { availableUser, messageRoom, loading } = useMessage();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPressOut={openNewChatModal}
          style={{
            padding: 8,
            borderRadius: 9999,
          }}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllMessageRoom(user._id));
    }, [dispatch])
  );

  const openNewChatModal = async () => {
    setIsModalVisible(true);
    setLoadingUsers(true);
    try {
      await dispatch(getAvailableUsers());
    } catch (e) {
      console.error("Lỗi khi lấy người dùng:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const startChatWithUser = async (participantId: string) => {
    setIsModalVisible(false);

    try {
      const result = await dispatch(createMessageRoom(participantId));

      const payload = result.payload;
      const roomId = payload?.data.roomId;

      if (roomId) {
        router.push(`/(chat)/chat-room/${roomId}`);
      } else {
        console.error("Không tìm thấy roomId trong kết quả createMessageRoom");
      }
    } catch (err) {
      console.error("Lỗi khi tạo phòng chat:", err);
    }
  };

  const filteredAvailableUsers = availableUser?.filter(
    (u) =>
      u._id !== user._id &&
      (u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 py-4">
        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-gray-600 mt-3 text-base font-medium">
              Đang tải cuộc trò chuyện...
            </Text>
          </View>
        ) : messageRoom.length === 0 ? (
          <View className="bg-blue-50 p-6 rounded-2xl items-center justify-center mt-8 border border-blue-200">
            <MaterialIcons name="forum" size={50} color="#2260FF" />
            <Text className="text-blue-800 text-lg font-semibold mt-4 text-center">
              Bạn chưa có cuộc trò chuyện nào.
            </Text>
            <Text className="text-blue-600 text-base mt-2 text-center max-w-xs">
              Bắt đầu một cuộc trò chuyện mới để kết nối với mọi người!
            </Text>
            <TouchableOpacity
              className="mt-6 bg-primary px-6 py-3 rounded-xl shadow-md"
              onPress={openNewChatModal}
            >
              <Text className="text-white font-bold text-base">
                Bắt đầu trò chuyện mới
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {messageRoom.map((conv) => {
              const withUser =
                conv.senderId._id === user._id
                  ? conv.receiverId
                  : conv.senderId;

              const lastMessageTime = new Date(
                conv.lastMessage?.createdAt || Date.now()
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              return (
                <Link
                  key={conv.roomId}
                  href={`/(chat)/chat-room/${conv.roomId}`}
                  asChild
                >
                  <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-xl mb-3 shadow-sm border border-gray-200 active:bg-gray-100">
                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                      <Text className="text-blue-600 text-xl font-bold">
                        {withUser.username
                          ? withUser.username.charAt(0).toUpperCase()
                          : "U"}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text
                          className="text-lg font-semibold text-gray-800 flex-1 pr-2"
                          numberOfLines={1}
                        >
                          {withUser.username}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {lastMessageTime}
                        </Text>
                      </View>
                      <Text
                        className="text-base text-gray-600"
                        numberOfLines={1}
                      >
                        {conv.lastMessage
                          ? conv.lastMessage.type === "FILE"
                            ? "[Hình ảnh]"
                            : conv.lastMessage.content
                          : "(Không có tin nhắn)"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              );
            })}
          </>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable className="bg-white w-full max-w-md rounded-2xl p-6 relative max-h-[80%] shadow-xl">
            <TouchableOpacity
              className="absolute top-4 right-4 z-10 p-1"
              onPress={() => setIsModalVisible(false)}
            >
              <MaterialIcons name="close" size={28} color="#6B7280" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
              Bắt đầu trò chuyện mới
            </Text>

            <TextInput
              placeholder="Tìm theo tên hoặc email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholderTextColor="#9CA3AF"
            />

            {loadingUsers ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="text-gray-500 mt-3 text-base">
                  Đang tải người dùng...
                </Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                {filteredAvailableUsers && filteredAvailableUsers.length > 0 ? (
                  filteredAvailableUsers.map((u, index, arr) => (
                    <Pressable
                      key={u._id}
                      onPress={() => startChatWithUser(u._id)}
                      className={`p-4 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100 ${
                        index !== arr.length - 1 ? "mb-3" : ""
                      }`}
                    >
                      <Text className="text-lg font-semibold text-gray-800">
                        {u.username}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-0.5">
                        {u.email}
                      </Text>
                      <Text className="text-xs italic text-indigo-500 mt-1">
                        {u.role}
                      </Text>
                    </Pressable>
                  ))
                ) : (
                  <Text className="text-center text-gray-500 mt-6 text-base">
                    Không tìm thấy người dùng phù hợp.
                  </Text>
                )}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
