import { useUser } from "@/libs/hooks/useUser";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

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
    gender: "Nam",
    role: "Phụ huynh",
    avatar: "https://i.pravatar.cc/150?img=15",
  });
  const { info } = useUser();
  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <ScrollView className="flex-1 bg-white pt-8">
      <View className="px-6 pb-6 items-center border-b border-gray-100">
        <Image
          source={{ uri: userProfile.avatar }}
          className="w-32 h-32 rounded-full border-4 border-primary mb-3"
          resizeMode="cover"
        />
        <Text className="text-2xl font-bold text-primary mb-1">
          {info?.username}
        </Text>
        <Text className="text-base text-gray-700">{userProfile.role}</Text>
      </View>

      <View className="px-6 py-6">
        <View className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <MaterialIcons name="email" size={24} color="#6B7280" />
          <View className="ml-3">
            <Text className="text-sm font-semibold text-gray-700">Email</Text>
            <Text className="text-base text-gray-800">{info?.email}</Text>
          </View>
        </View>

        {userProfile.phoneNumber && (
          <View className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <MaterialIcons name="phone" size={24} color="#6B7280" />
            <View className="ml-3">
              <Text className="text-sm font-semibold text-gray-700">
                Số điện thoại
              </Text>
              <Text className="text-base text-gray-800">{info?.phone}</Text>
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
                {formatDate(info?.dob)}
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
