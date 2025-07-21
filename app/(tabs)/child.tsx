import { useHealthProfile } from "@/libs/hooks/useHealthProfile";
import { useAppDispatch } from "@/libs/stores";
import {
  claimStudent,
  getMyChild,
} from "@/libs/stores/healthProfileManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { Link } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChildScreen() {
  const dispatch = useAppDispatch();
  const { myChild, loading } = useHealthProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyChild());
    }, [dispatch])
  );

  const filteredChildren = useMemo(() => {
    return myChild.filter((child) =>
      child.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [myChild, searchQuery]);

  const handleAddChild = async () => {
    if (inviteCode.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập mã mời.");
      return;
    }

    try {
      const resultAction = await dispatch(claimStudent(inviteCode));
      if (claimStudent.fulfilled.match(resultAction)) {
        await dispatch(getMyChild());
        setModalVisible(false);
        setInviteCode("");
        Alert.alert("Thành công", "Đã thêm hồ sơ bé thành công.");
      } else {
        Alert.alert(
          "Thất bại",
          "Không thể thêm hồ sơ. Vui lòng kiểm tra lại mã mời."
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm hồ sơ.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-3 text-gray-600">Đang tải hồ sơ bé...</Text>
      </View>
    );
  }

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
                key={child._id}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-tertiary"
              >
                <Text className="text-xl font-bold text-primary mb-2">
                  {child.fullName}
                </Text>

                <Text className="text-gray-700 text-base mb-1">
                  Lớp: {child.classId?.className}
                </Text>

                <Text className="text-gray-700 text-base mb-1">
                  Ngày sinh: {dayjs(child.dateOfBirth).format("DD/MM/YYYY")}
                </Text>

                <Text className="text-gray-700 text-base mb-1">
                  Giới tính: {child.gender === "MALE" ? "Nam" : "Nữ"}
                </Text>

                <Link href={`/(child)/detail/${child._id}`} asChild>
                  <TouchableOpacity className="mt-4 px-5 py-2 rounded-lg flex-row items-center justify-center bg-primary">
                    <Text className="text-white font-semibold text-base mr-2">
                      Chi tiết
                    </Text>
                    <MaterialIcons
                      name="arrow-right-alt"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </Link>
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
