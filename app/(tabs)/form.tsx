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
    title: "Thông tin sức khỏe",
    icon: "medical-information",
    data: [
      {
        icon: "medical-services",
        label: "Khám sức khỏe",
        route: "/(health-check)",
        color: "#10B981",
        bg: "bg-green-100",
      },
      {
        icon: "vaccines",
        label: "Tiêm chủng",
        route: "/(vaccination)",
        color: "#EF4444",
        bg: "bg-red-100",
      },
    ],
  },
  {
    title: "Lịch trình",
    icon: "event",
    data: [
      {
        icon: "event-available",
        label: "Lịch uống thuốc",
        route: "/(medication-schedule)",
        color: "#F59E0B",
        bg: "bg-yellow-100",
      },
      {
        icon: "event-note",
        label: "Lịch hẹn",
        route: "/(appointment)",
        color: "#8B5CF6",
        bg: "bg-purple-100",
      },
    ],
  },
  {
    title: "Tình trạng",
    icon: "health-and-safety",
    data: [
      {
        icon: "sick",
        label: "Sự cố y tế",
        route: "/(incident)",
        color: "#F43F5E",
        bg: "bg-pink-100",
      },
      {
        icon: "check-circle",
        label: "Đơn tiêm chủng",
        route: "/(vaccination-consent)",
        color: "#3B82F6",
        bg: "bg-blue-100",
      },
      {
        icon: "fact-check",
        label: "Đơn khám sức khỏe",
        route: "/(healthCheck-consent)",
        color: "#14B8A6",
        bg: "bg-teal-100",
      },
    ],
  },
];

export default function FormScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 48) / 2;

  return (
    <ScrollView
      className="flex-1 bg-white pt-6"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {sections.map((section, sIndex) => (
        <View key={sIndex} className="mb-6 px-4">
          <View className="flex-row items-center justify-center mb-3">
            {section.icon && (
              <MaterialIcons
                name={section.icon as any}
                size={22}
                color="#4B5563"
                style={{ marginRight: 6 }}
              />
            )}
            <Text className="text-lg font-semibold text-gray-800">
              {section.title}
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {section.data.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route as any)}
                style={{
                  width: cardWidth,
                  marginRight: index % 2 === 0 ? 16 : 0,
                }}
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
        </View>
      ))}
    </ScrollView>
  );
}
