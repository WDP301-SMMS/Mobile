import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const today = "Thứ Hai, 9 Tháng 6, 2025";

  return (
    <ScrollView className="flex-1 bg-white pt-10">
      <View className="flex-row items-center justify-between px-6 pb-6 border-b border-primary">
        <View>
          <Text className="text-base text-gray-500">Chào buổi sáng,</Text>
          <Text className="text-3xl font-extrabold text-primary mt-1">
            Hoàng Thị Hoa
          </Text>
          <Text className="text-sm text-gray-400 mt-1">{today}</Text>
        </View>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=5" }}
          className="w-16 h-16 rounded-full border-2 border-secondary"
        />
      </View>

      <View className="mb-8 px-6 pt-6">
        <Text className="text-xl font-bold text-primary mb-5">
          Việc Cần Chú Ý
        </Text>

        {[
          {
            image: require("@/assets/icons/consent.png"),
            title: "Phiếu Đồng Ý Tiêm Sởi",
            child: "Nguyễn Văn A",
            note: "Hạn phản hồi: 10/06/2025",
            urgency: "urgent",
          },
          {
            image: require("@/assets/icons/schedule.png"),
            title: "Lịch Hẹn Khám Tổng Quát",
            child: "Nguyễn Văn B",
            note: "Ngày 13/06/2025, 09:00 sáng",
            urgency: "normal",
          },
        ].map((item, index) => (
          <View
            key={index}
            className={`flex-row items-center rounded-2xl p-4 mb-4 shadow-sm border
              ${
                item.urgency === "urgent"
                  ? "bg-red-50 border-danger"
                  : "bg-sky-50 border-tertiary"
              }`}
          >
            <Image
              source={item.image}
              className={`w-12 h-12 mr-4 ${
                item.urgency === "completed" ? "opacity-50" : ""
              }`}
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text
                className={`text-base font-semibold mb-1
                ${
                  item.urgency === "urgent"
                    ? "text-danger"
                    : item.urgency === "completed"
                    ? "text-gray-500 line-through"
                    : "text-primary"
                }`}
              >
                {item.title}
              </Text>
              {!!item.child && (
                <Text
                  className={`text-sm mb-0.5
                  ${
                    item.urgency === "urgent"
                      ? "text-red-700"
                      : item.urgency === "completed"
                      ? "text-gray-400"
                      : "text-blue-700"
                  }`}
                >
                  <Text className="font-medium">Học sinh:</Text> {item.child}
                </Text>
              )}
              {!!item.note && (
                <Text
                  className={`text-xs font-medium
                  ${
                    item.urgency === "urgent"
                      ? "text-red-600"
                      : item.urgency === "completed"
                      ? "text-gray-400"
                      : "text-blue-600"
                  }`}
                >
                  {item.note}
                </Text>
              )}
            </View>
          </View>
        ))}

        <Link href={"/(tabs)/form"} asChild>
          <TouchableOpacity className="mt-2 self-start flex-row items-center">
            <Text className="text-secondary text-base font-semibold mr-1">
              Xem tất cả đơn từ & kết quả
            </Text>
            <MaterialIcons name="arrow-right-alt" size={24} color={"#81D4FA"} />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mb-12 px-6 pb-20">
        <Text className="text-xl font-bold text-primary mb-5">Khám Phá</Text>

        <Link href={"/(tabs)/child"} asChild>
          <TouchableOpacity className="bg-tertiary p-5 rounded-2xl flex-row items-center justify-between mb-4">
            <Image
              source={require("@/assets/icons/children.png")}
              className="w-20 h-20 mr-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-primary font-semibold text-lg mb-1">
                Hồ sơ sức khỏe của con
              </Text>
              <Text className="text-gray-600 text-sm mb-3">
                Xem lịch sử khám, tiêm chủng và thông tin chi tiết từng học
                sinh.
              </Text>
              <View className="bg-primary px-4 py-2 rounded-lg self-start flex-row items-center">
                <Text className="text-white font-semibold text-sm mr-2">
                  Đi đến Con tôi
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href={"/(tabs)/info"} asChild>
          <TouchableOpacity className="bg-tertiary p-5 rounded-2xl flex-row items-center justify-between">
            <Image
              source={require("@/assets/icons/setting.png")}
              className="w-20 h-20 mr-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-primary font-semibold text-lg mb-1">
                Quản lý tài khoản
              </Text>
              <Text className="text-gray-600 text-sm mb-3">
                Cập nhật thông tin cá nhân, cài đặt và tùy chỉnh ứng dụng.
              </Text>
              <View className="bg-primary px-4 py-2 rounded-lg self-start flex-row items-center">
                <Text className="text-white font-semibold text-sm mr-2">
                  Cá nhân
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
