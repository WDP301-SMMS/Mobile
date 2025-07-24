import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/libs/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "";
    return new Date(isoDate).toLocaleDateString("vi-VN");
  };

  const getGenderLabel = (gender: string) => {
    if (gender === "MALE") return "Nam";
    if (gender === "FEMALE") return "Nữ";
    return "";
  };

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-white pt-8">
      <View className="px-6 pb-6 items-center border-b border-gray-100">
        <UserAvatar username={user.username} size={128} fontSize={42} />
        <Text className="text-2xl font-bold text-primary mb-1 mt-3">
          {user.username}
        </Text>
        <Text className="text-base text-gray-700">
          {user.role === "Parent" ? "Phụ huynh" : user.role}
        </Text>
      </View>

      <View className="px-6 py-6">
        <InfoRow icon="email" label="Email" value={user.email} />

        {user.phone && (
          <InfoRow icon="phone" label="Số điện thoại" value={user.phone} />
        )}

        {user.dob && (
          <InfoRow icon="cake" label="Ngày sinh" value={formatDate(user.dob)} />
        )}

        {user.gender === "MALE" || user.gender === "FEMALE" ? (
          <InfoRow
            icon="wc"
            label="Giới tính"
            value={getGenderLabel(user.gender)}
          />
        ) : null}

        <TouchableOpacity
          className="mt-2 mb-4 bg-blue-600 rounded-lg py-3 px-4"
          onPress={() => router.push("/(profile)/changePassword")}
        >
          <Text className="text-white text-center font-semibold">
            Thay đổi mật khẩu
          </Text>
        </TouchableOpacity>

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

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg">
      <MaterialIcons name={icon} size={24} color="#6B7280" />
      <View className="ml-3">
        <Text className="text-sm font-semibold text-gray-700">{label}</Text>
        <Text className="text-base text-gray-800">{value}</Text>
      </View>
    </View>
  );
}
