import { Message } from "@/libs/types/message";
import { Text, View } from "react-native";
import { MessageBubble } from "./MessageBuble";

interface Props {
  messages: Message[];
  isSender: (userId: string) => boolean;
  header: string;
}

const TIME_GAP = 30 * 60 * 1000;

export const ChatMessageGroup = ({ messages, isSender, header }: Props) => {
  if (messages.length === 0) return null;

  const shouldShowTime = (index: number) => {
    if (index === messages.length - 1) return true;
    const current = new Date(messages[index].createdAt).getTime();
    const next = new Date(messages[index + 1].createdAt).getTime();
    return next - current >= TIME_GAP;
  };

  const shouldShowName = (index: number) => {
    const current = messages[index];
    const previous = messages[index - 1];

    return (
      !isSender(current.senderId._id) &&
      (index === 0 || previous.senderId._id !== current.senderId._id)
    );
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="mb-6">
      <Text className="text-center text-gray-500 text-sm mb-2">{header}</Text>

      {messages.map((msg, index) => {
        const isMine = isSender(msg.senderId._id);

        return (
          <View key={msg._id || index} className="mb-1">
            {shouldShowTime(index) && (
              <Text className="text-center text-sm text-gray-400 my-5">
                {formatTime(msg.createdAt)}
              </Text>
            )}
            {shouldShowName(index) && (
              <Text className="text-sm text-gray-700 mb-1 ml-2">
                {msg.senderId.username}
              </Text>
            )}
            <MessageBubble
              isSender={isMine}
              content={msg.content}
              type={msg.type}
            />
          </View>
        );
      })}
    </View>
  );
};
