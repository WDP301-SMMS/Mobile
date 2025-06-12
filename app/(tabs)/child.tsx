import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChildScreen() {
  const [children, setChildren] = useState([
    {
      id: "1",
      fullName: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?img=6",
      className: "Lớp 3A",
      schoolYear: "2023-2024",
      dob: "15/09/2017",
      gender: "Nam",
    },
    {
      id: "2",
      fullName: "Trần Thị B",
      avatar: "https://i.pravatar.cc/150?img=10",
      className: "Lớp 5C",
      schoolYear: "2022-2023",
      dob: "20/03/2015",
      gender: "Nữ",
    },
    {
      id: "3",
      fullName: "Lê Minh C",
      avatar: "https://i.pravatar.cc/150?img=11",
      className: "Lớp 1B",
      schoolYear: "2024-2025",
      dob: "01/11/2019",
      gender: "Nam",
    },
    {
      id: "4",
      fullName: "Phạm Thị D",
      avatar: "https://i.pravatar.cc/150?img=12",
      className: "Lớp 3A",
      schoolYear: "2023-2024",
      dob: "05/07/2017",
      gender: "Nữ",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const filteredChildren = useMemo(() => {
    return children.filter((child) =>
      child.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [children, searchQuery]);

  const handleAddChild = () => {
    if (inviteCode === "HS0001") {
      setInviteCode("");
      setModalVisible(false);
      Alert.alert("Thành công", "Đã thêm hồ sơ bé thành công!");
    } else {
      Alert.alert("Mã không hợp lệ", "Vui lòng nhập đúng mã mời.");
    }
  };

  return (
    <>
      <ScrollView className="flex-1 bg-white pt-4">
        <View className="px-6">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2 border border-gray-200">
            <MaterialIcons name="search" size={24} color="#888" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-800"
              placeholder="Tìm kiếm theo tên bé..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              numberOfLines={1}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                className="p-1"
              >
                <MaterialIcons name="clear" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="px-6 pt-4">
          {filteredChildren.length > 0 ? (
            filteredChildren.map((child) => (
              <View
                key={child.id}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-tertiary"
              >
                <View className="flex-row items-center mb-4">
                  <Image
                    source={{ uri: child.avatar }}
                    className="w-20 h-20 rounded-full border-4 border-secondary mr-4"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-primary mb-1">
                      {child.fullName}
                    </Text>
                    <Text className="text-base text-gray-700">
                      {child.className}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-0.5">
                      Niên khóa: {child.schoolYear}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-gray-100 pt-3 mt-3">
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons name="cake" size={18} color="#6B7280" />
                    <Text className="text-gray-600 ml-2">
                      Ngày sinh: {child.dob}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="wc" size={18} color="#6B7280" />
                    <Text className="text-gray-600 ml-2">
                      Giới tính: {child.gender}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="mt-4 px-5 py-2 rounded-lg flex-row items-center justify-center bg-primary">
                  <Link href={`/(child)/${child.id}`} asChild>
                    <Text className="text-white font-semibold text-base mr-2">
                      Chi tiết
                    </Text>
                  </Link>
                  <MaterialIcons
                    name="arrow-right-alt"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="bg-gray-50 p-4 rounded-lg items-center justify-center">
              <MaterialIcons name="info-outline" size={30} color="#888" />
              <Text className="text-gray-600 text-base mt-2 text-center">
                Không tìm thấy hồ sơ bé phù hợp.
              </Text>
            </View>
          )}
        </View>

        <View className="px-6 pb-28 pt-4">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-primary p-4 rounded-2xl flex-row items-center justify-center border border-tertiary"
          >
            <MaterialIcons name="add-circle-outline" size={28} color="#FFF" />
            <Text className="text-white text-lg font-semibold ml-3">
              Thêm Hồ Sơ Bé
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal nhập mã mời */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/30 px-6">
          <View className="bg-white rounded-2xl w-full p-6 shadow-md">
            <Text className="text-lg font-semibold mb-4 text-center text-primary">
              Nhập mã mời để thêm hồ sơ bé
            </Text>
            <TextInput
              placeholder="Nhập mã mời (VD: HS0001)"
              className="border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-800 mb-4"
              value={inviteCode}
              onChangeText={setInviteCode}
              numberOfLines={1}
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 rounded-lg mr-2 bg-gray-200"
              >
                <Text className="text-gray-700">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddChild}
                className="px-4 py-2 rounded-lg bg-primary"
              >
                <Text className="text-white font-semibold">Hoàn thành</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
