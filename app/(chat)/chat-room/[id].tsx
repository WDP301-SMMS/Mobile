import { ChatMessageGroup } from "@/components/message/ChatMessageGroup";
import { useAuth } from "@/libs/context/AuthContext";
import { useMessage } from "@/libs/hooks/useMessage";
import { useSocket } from "@/libs/hooks/useSocket";
import { useAppDispatch } from "@/libs/stores";
import {
  addMessageToLocal,
  clearMessages,
} from "@/libs/stores/messageManager/slice";
import {
  getMessageRoom,
  uploadImage,
} from "@/libs/stores/messageManager/thunk";
import { Message } from "@/libs/types/message";
import { formatDateHeader } from "@/libs/utils/formatDateHeader";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import debounce from "lodash.debounce";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";

export default function ChatDetailScreen() {
  const { id: roomId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { message } = useMessage();
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const receiverUser = useMemo(() => {
    if (message.length === 0 || !user) return undefined;
    const msg = message[0];
    return msg.senderId._id === user._id ? msg.receiverId : msg.senderId;
  }, [message, user]);

  useLayoutEffect(() => {
    if (receiverUser?.username) {
      navigation.setOptions({
        title: receiverUser.username,
        headerTitleAlign: "center",
      });
    }
  }, [receiverUser]);

  const isSender = useCallback((id: string) => user?._id === id, [user]);

  useEffect(() => {
    if (roomId) {
      dispatch(clearMessages());
      dispatch(getMessageRoom(roomId as string));
    }
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg: Message) => {
      dispatch(addMessageToLocal(msg));
    };

    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (senderId !== user?._id) setIsTyping(true);
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      if (senderId !== user?._id) setIsTyping(false);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, dispatch, user?._id]);

  useEffect(() => {
    if (!socket || !user || !receiverUser || !roomId) return () => {};

    socket.emit("joinRoom", user._id, receiverUser._id);
    return () => {
      socket.emit("leaveRoom", roomId);
    };
  }, [socket, user, receiverUser, roomId]);

  const sendMessage = useCallback(
    (content: string, type: "TEXT" | "FILE") => {
      if (!socket || !user || !receiverUser || !roomId) return;

      const payload: Omit<Message, "_id"> = {
        roomId: roomId as string,
        senderId: user,
        receiverId: receiverUser,
        content,
        type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      socket.emit("sendMessage", payload);
    },
    [socket, user, receiverUser, roomId]
  );

  const debouncedStopTyping = useMemo(
    () =>
      debounce(() => {
        if (socket && roomId && user) {
          socket.emit("stopTyping", { roomId, senderId: user._id });
        }
      }, 1000),
    [socket, roomId, user]
  );

  const handleTextChange = (text: string) => {
    setNewMessage(text);
    if (socket && roomId && user) {
      socket.emit("typing", { roomId, senderId: user._id });
      debouncedStopTyping();
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage.trim(), "TEXT");
      setNewMessage("");
    }
  };

  const handlePickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", selectionLimit: 1 },
      async (res) => {
        const asset = res.assets?.[0];
        if (res.didCancel || !asset?.uri || !asset?.type || !asset?.fileName) {
          if (res.errorMessage) Alert.alert("Lỗi", res.errorMessage);
          return;
        }

        try {
          const formData = new FormData();
          formData.append("file", {
            uri: asset.uri,
            name: asset.fileName,
            type: asset.type,
          } as any);

          const { url } = await dispatch(uploadImage(formData)).unwrap();
          sendMessage(url, "FILE");
        } catch {
          Alert.alert("Lỗi gửi ảnh", "Không thể upload hoặc gửi ảnh");
        }
      }
    );
  };

  const groupMessages = (messages: Message[]) => {
    const grouped: {
      header: string;
      messages: Message[];
    }[] = [];

    let currentGroup: Message[] = [];
    let lastSender = "";
    let lastTimestamp = 0;
    let lastHeader = "";

    const TIME_GAP = 30 * 60 * 1000;

    for (const msg of messages) {
      const senderId = msg.senderId._id;
      const createdAt = new Date(msg.createdAt).getTime();
      const header = formatDateHeader(msg.createdAt);

      const shouldStartNewGroup =
        createdAt - lastTimestamp > TIME_GAP || header !== lastHeader;

      if (shouldStartNewGroup && currentGroup.length > 0) {
        grouped.push({
          header: lastHeader, // luôn truyền header ngày
          messages: currentGroup,
        });
        currentGroup = [];
      }

      currentGroup.push(msg);
      lastSender = senderId;
      lastTimestamp = createdAt;
      lastHeader = header;
    }

    if (currentGroup.length > 0) {
      grouped.push({
        header: lastHeader,
        messages: currentGroup,
      });
    }

    return grouped;
  };

  const sortedMessages = [...message].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {groupMessages(sortedMessages).map((group, index) => (
          <ChatMessageGroup
            key={index}
            messages={group.messages}
            header={group.header}
            isSender={isSender}
          />
        ))}
      </ScrollView>

      <View className="h-6 px-4">
        {isTyping && <Text className="text-gray-500 italic">Đang soạn...</Text>}
      </View>

      <View className="flex-row items-center p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity onPress={handlePickImage} className="p-2 mr-2">
          <Entypo name="image" size={24} color="#2260FF" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 p-3 border border-gray-300 rounded-2xl mr-3 text-base"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChangeText={handleTextChange} 
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />

        <TouchableOpacity
          onPress={handleSendMessage}
          className="bg-primary p-3 rounded-full"
        >
          <MaterialIcons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}