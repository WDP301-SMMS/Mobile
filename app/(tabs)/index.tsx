import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const now = new Date();
  const weekday = now.toLocaleDateString("vi-VN", { weekday: "long" });
  const date = now.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <ScrollView className="flex-1 bg-white pt-10">
      <View className="flex-col justify-between gap-y-5 bg-primary px-6 pt-6 pb-4 border-b border-primary/10">
        <View className="flex-row items-center justify-between">
          <Link href={"/(tabs)/info"} asChild>
            <TouchableOpacity className="flex-row items-center space-x-4">
              <Image
                source={{ uri: "https://i.pravatar.cc/100?img=15" }}
                className="w-14 h-14 rounded-full border-2 border-secondary"
              />
              <Text className="text-xl font-bold text-white ml-2">
                Võ Văn Phụ Huynh
              </Text>
            </TouchableOpacity>
          </Link>
          <View className="flex-row gap-x-4">
            <Link href={"/(notification)"} asChild>
              <TouchableOpacity className="p-2 rounded-full bg-tertiary">
                <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color="#2260FF"
                />
              </TouchableOpacity>
            </Link>
            <Link href={"/(chat)"} asChild>
              <TouchableOpacity className="p-2 rounded-full bg-tertiary">
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={24}
                  color="#2260FF"
                />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        <View className="flex items-end">
          <Text className="text-sm font-semibold text-tertiary capitalize">
            {weekday}, {date}
          </Text>
        </View>
      </View>

      <View className="mb-8 px-6 pt-6">
        <View className="flex-row items-center mb-5">
          <MaterialIcons
            name="notifications-on"
            size={28}
            color="#EFBF04"
            className="mr-2"
          />
          <Text className="text-2xl font-bold text-primary">
            Việc cần chú ý
          </Text>
        </View>

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
            className={`flex-row items-center rounded-2xl p-4 mb-4 shadow-md ${
              item.urgency === "urgent"
                ? "bg-red-50 border-l-4 border-danger"
                : "bg-sky-50 border-l-4 border-secondary"
            }`}
          >
            <Image
              source={item.image}
              className="w-12 h-12 mr-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text
                className={`text-base font-bold mb-1 ${
                  item.urgency === "urgent" ? "text-danger" : "text-primary"
                }`}
              >
                {item.title}
              </Text>
              <Text
                className={`text-sm mb-0.5 ${
                  item.urgency === "urgent" ? "text-red-700" : "text-blue-700"
                }`}
              >
                <Text className="font-semibold">Học sinh:</Text> {item.child}
              </Text>
              <Text
                className={`text-xs font-medium ${
                  item.urgency === "urgent" ? "text-red-600" : "text-blue-600"
                }`}
              >
                {item.note}
              </Text>
            </View>
          </View>
        ))}

        <Link href={"/(tabs)/form"} asChild>
          <TouchableOpacity className="mt-2 self-start flex-row items-center p-2 rounded-lg">
            <Text className="text-secondary text-base font-semibold mr-1">
              Xem tất cả đơn từ & kết quả
            </Text>
            <MaterialIcons name="arrow-right-alt" size={24} color={"#22CEFF"} />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mb-12 px-6 pb-20">
        <View className="flex-row items-center mb-5">
          <MaterialIcons
            name="auto-awesome"
            size={28}
            color="#EFBF04"
            className="mr-2"
          />
          <Text className="text-2xl font-bold text-primary">Khám phá</Text>
        </View>

        <Link href={"/(tabs)/child"} asChild>
          <TouchableOpacity className="bg-tertiary p-5 rounded-2xl flex-row items-center justify-between mb-4 shadow-md">
            <Image
              source={require("@/assets/icons/children.png")}
              className="w-20 h-20 mr-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-primary font-bold text-lg mb-1">
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
          <TouchableOpacity className="bg-tertiary p-5 rounded-2xl flex-row items-center justify-between shadow-md">
            <Image
              source={require("@/assets/icons/setting.png")}
              className="w-20 h-20 mr-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-primary font-bold text-lg mb-1">
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
