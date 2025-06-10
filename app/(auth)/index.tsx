import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function EntryScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 items-center justify-between px-6 py-10">
        <Image
          source={require("@/assets/images/splash-icon-blue.png")}
          resizeMode="contain"
          className="w-44 h-44 mb-6"
        />

        <Image
          source={require("@/assets/images/background.png")}
          resizeMode="contain"
          className="w-full h-48 mb-6"
        />

        <View className="mb-10">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            Chào mừng đến với <Text className="text-primary">EduCare</Text>
          </Text>
          <Text className="text-base font-medium text-gray-600 text-center">
            Ứng dụng y tế học đường dành cho phụ huynh và học sinh
          </Text>
        </View>

        <View className="w-full">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            className="bg-primary px-6 py-3 rounded-full mb-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Đăng ký
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/signin")}
            className="border border-primary px-6 py-3 rounded-full"
          >
            <Text className="text-primary text-center font-semibold text-lg">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
