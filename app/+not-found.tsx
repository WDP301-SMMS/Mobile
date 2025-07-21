import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Stack } from "expo-router";
import { Image } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView className="flex-1 items-center justify-center bg-white px-6">
        <Image
          source={{
            uri: "https://i.gifer.com/7efs.gif",
          }}
          className="w-64 h-48 mb-6"
          resizeMode="contain"
        />
        <ThemedText type="title" className="text-xl font-bold text-center mb-2">
          Trang không tồn tại!
        </ThemedText>
        <ThemedText
          type="default"
          className="text-base text-gray-500 text-center mb-6"
        >
          Có vẻ như bạn đang tìm một trang không tồn tại hoặc đã bị xóa.
        </ThemedText>
        <Link href="/" className="bg-blue-600 px-6 py-3 rounded-lg">
          <ThemedText type="link" className="text-white font-semibold text-base">
            Quay về Trang chủ
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
