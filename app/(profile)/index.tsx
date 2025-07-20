import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/libs/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  role: string;
  school?: string;
  avatar: string;
}

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "user123",
    fullName: "Võ Văn Phụ Huynh",
    email: "phuhuynh.a@example.com",
    phoneNumber: "0901 234 567",
    dob: "25/10/1985",
    gender: "Nam",
    role: "Phụ huynh",
    avatar: "https://i.pravatar.cc/150?img=15",
  });
  const { user } = useAuth();
  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <ScrollView className="flex-1 bg-white pt-8">
      <View className="px-6 pb-6 items-center border-b border-gray-100">
        <UserAvatar username={user?.username ?? ""} size={128} fontSize={42} />
        <Text className="text-2xl font-bold text-primary mb-1 mt-3">
          {user.username}
        </Text>
        <Text className="text-base text-gray-700">
          {user?.role === "Parent" ? "Phụ huynh" : user?.role}
        </Text>
      </View>

      <View className="px-6 py-6">
        <View className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <MaterialIcons name="email" size={24} color="#6B7280" />
          <View className="ml-3">
            <Text className="text-sm font-semibold text-gray-700">Email</Text>
            <Text className="text-base text-gray-800">{user?.email}</Text>
          </View>
        </View>

        {userProfile.phoneNumber && (
          <View className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <MaterialIcons name="phone" size={24} color="#6B7280" />
            <View className="ml-3">
              <Text className="text-sm font-semibold text-gray-700">
                Số điện thoại
              </Text>
              <Text className="text-base text-gray-800">{user?.phone}</Text>
            </View>
          </View>
        )}

        {userProfile.dob && (
          <View className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <MaterialIcons name="cake" size={24} color="#6B7280" />
            <View className="ml-3">
              <Text className="text-sm font-semibold text-gray-700">
                Ngày sinh
              </Text>
              <Text className="text-base text-gray-800">
                {formatDate(user?.dob)}
              </Text>
            </View>
          </View>
        )}

        {userProfile.gender && (
          <View className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <MaterialIcons name="wc" size={24} color="#6B7280" />
            <View className="ml-3">
              <Text className="text-sm font-semibold text-gray-700">
                Giới tính
              </Text>
              <Text className="text-base text-gray-800">
                {userProfile.gender}
              </Text>
            </View>
          </View>
        )}

        <View className="my-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="text-base font-semibold text-blue-700 mb-2">
            Lưu ý quan trọng:
          </Text>
          <Text className="text-sm text-blue-600">
            Mọi thông tin cá nhân của bạn đều được bảo mật. Vui lòng liên hệ bộ
            phận hỗ trợ nếu có bất kỳ thắc mắc nào.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
