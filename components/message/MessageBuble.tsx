import { Image, Text, View } from "react-native";

interface Props {
  isSender: boolean;
  content: string;
  type: string;
}

export const MessageBubble = ({ isSender, content, type }: Props) => {
  const isImage = type === "FILE";
  const alignment = isSender ? "justify-end" : "justify-start";
  const bubbleStyle = isSender
    ? "bg-primary rounded-br-none"
    : "bg-gray-200 rounded-bl-none";
  const textColor = isSender ? "text-white" : "text-gray-800";

  return (
    <View className={`flex-row items-end mb-1 ${alignment}`}>
      <View
        className={`max-w-[70%] ${
          isImage ? "" : `p-3 rounded-lg ${bubbleStyle}`
        }`}
      >
        {isImage ? (
          <Image
            source={{ uri: content }}
            className="rounded-md max-w-[280px] max-h-[280px] w-full aspect-square"
            resizeMode="cover"
          />
        ) : (
          <Text className={textColor}>{content}</Text>
        )}
      </View>
    </View>
  );
};
