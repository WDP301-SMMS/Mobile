import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/libs/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function InfoScreen() {
  const { logout, user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white pt-8">
      <View className="px-6 pb-6 border-b border-gray-100 items-center">
        <UserAvatar username={user?.username ?? ""} size={112} fontSize={42}/>
        <Text className="text-2xl font-bold text-primary mb-1">
          {user?.username}
        </Text>
        <Text className="text-base text-gray-700">
          {user?.role === "Parent" ? "Phụ huynh" : user?.role}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">{user?.phone}</Text>
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
            Alert.alert(
              "Xác nhận Đăng xuất",
              "Bạn có chắc muốn đăng xuất khỏi tài khoản không?",
              [
                { text: "Hủy", style: "cancel" },
                { text: "Đăng xuất", onPress: logout, style: "destructive" },
              ]
            );
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
