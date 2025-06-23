import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const sections = [
  {
    icon: "description",
    label: "Đơn đồng ý",
    route: "/(form)/consent",
    color: "#2563EB",
    bg: "bg-blue-100",
  },
  {
    icon: "medical-services",
    label: "Khám sức khỏe",
    route: "/(form)/medical-results",
    color: "#10B981",
    bg: "bg-green-100",
  },
  {
    icon: "event-available",
    label: "Lịch hẹn",
    route: "/(form)/schedule",
    color: "#F59E0B",
    bg: "bg-yellow-100",
  },
  {
    icon: "history",
    label: "Lịch sử tiêm",
    route: "/(form)/vaccination-history",
    color: "#EF4444",
    bg: "bg-red-100",
  },
  {
    icon: "folder-shared",
    label: "Hồ sơ sức khỏe",
    route: "/(form)/health-profile",
    color: "#6B7280",
    bg: "bg-gray-200",
  },
];

export default function FormScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 32 - 16) / 2; // padding + gap

  return (
    <ScrollView className="flex-1 bg-white pt-6">
      <Text className="text-2xl font-bold text-center text-primary mb-6">
        Hồ sơ y tế của con
      </Text>

      <View className="flex-row flex-wrap px-4 justify-between pb-12">
        {sections.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route as any)}
            style={{ width: cardWidth }}
            className={`mb-4 rounded-2xl px-4 py-6 items-center justify-center ${item.bg} shadow-sm`}
          >
            <MaterialIcons
              name={item.icon as any}
              size={36}
              color={item.color}
            />
            <Text className="mt-3 text-center text-[15px] font-semibold text-gray-800">
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
