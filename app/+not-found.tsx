import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Không tìm thấy" }} />
      <View className="flex-1 justify-center items-center bg-primary px-6">
        <Image
          source={{
            uri: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHk4a3F6MTFzYWdyano5bGpwYXg3dHhqbWR4bDVndXBpY2h3MGUxMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dHM/XRNxTSmaJYYV9D13Fb/giphy.gif",
          }}
          className="w-64 h-48 mb-6"
          resizeMode="contain"
        />
        <Text className="text-xl font-bold text-center text-gray-300 mb-7">
          Trang không tồn tại!
        </Text>

        <TouchableOpacity
          className="flex-row items-center bg-white border border-primary px-4 py-2 rounded-md"
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="home" size={20} color="#2260FF" />
          <Text className="ml-2 text-primary font-semibold">
            Về màn hình chính
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
