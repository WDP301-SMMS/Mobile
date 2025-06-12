import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const currentUser = {
  fullName: "Võ Văn Phụ Huynh",
  phone: "0958491234",
  avatar: "https://i.pravatar.cc/150?img=15",
  role: "Phụ huynh",
};

export default function InfoScreen() {
  return (
    <ScrollView className="flex-1 bg-white pt-8">
      <View className="px-6 pb-6 border-b border-gray-100 items-center">
        <Image
          source={{ uri: currentUser.avatar }}
          className="w-28 h-28 rounded-full border-4 border-primary mb-3"
          resizeMode="cover"
        />
        <Text className="text-2xl font-bold text-primary mb-1">
          {currentUser.fullName}
        </Text>
        <Text className="text-base text-gray-700">{currentUser.role}</Text>
        <Text className="text-sm text-gray-500 mt-1">{currentUser.phone}</Text>
      </View>

      <View className="px-6 py-6">
        <Link href="/(profile)" asChild>
          <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 mb-3">
            <View className="flex-row items-center">
              <MaterialIcons name="person-outline" size={24} color="#2260FF" />
              <Text className="text-lg font-semibold text-primary ml-4">
                Thông tin cá nhân
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </Link>

        <Link href="/(notification)" asChild>
          <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 mb-3">
            <View className="flex-row items-center">
              <MaterialIcons
                name="notifications-none"
                size={24}
                color="#2260FF"
              />
              <Text className="text-lg font-semibold text-primary ml-4">
                Thông báo
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </Link>

        <Link href="/(chat)" asChild>
          <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 mb-3">
            <View className="flex-row items-center">
              <MaterialIcons
                name="messenger-outline"
                size={24}
                color="#2260FF"
              />
              <Text className="text-lg font-semibold text-primary ml-4">
                Tin nhắn
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          className="flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-red-300 mt-6"
          onPress={() => {
            console.log("Người dùng đã đăng xuất");
          }}
        >
          <View className="flex-row items-center">
            <MaterialIcons name="logout" size={24} color="#EF4444" />
            <Text className="text-lg font-semibold text-red-500 ml-4">
              Đăng xuất
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
