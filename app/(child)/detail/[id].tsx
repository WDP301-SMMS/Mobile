// Updated ChildDetailScreen.tsx to use real healthProfile data
import { useHealthProfile } from "@/libs/hooks/useHealthProfile";
import { useAppDispatch } from "@/libs/stores";
import { studentHealthProfile } from "@/libs/stores/healthProfileManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { healthProfile, loading } = useHealthProfile();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(studentHealthProfile(id as string));
      }
    }, [dispatch, id])
  );

  const student = healthProfile?.studentInfo;

  if (loading || !healthProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0288D1" />
        <Text className="mt-2 text-gray-600">Đang tải hồ sơ...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white pt-8">
      <Stack.Screen
        options={{
          title: student?.fullName || "Chi tiết học sinh",
          headerBackTitle: "Quay lại",
        }}
      />

      <View className="px-6 pb-6 border-b border-gray-100">
        <Text className="text-3xl font-extrabold text-primary mb-1">
          {student?.fullName}
        </Text>
        <Text className="text-base text-gray-600">
          Ngày sinh:{" "}
          {student?.dateOfBirth
            ? dayjs(student.dateOfBirth).format("DD/MM/YYYY")
            : "--"}
        </Text>
        <Text className="text-base text-gray-600">
          Giới tính: {student?.gender === "MALE" ? "Nam" : "Nữ"}
        </Text>
      </View>

      {/* --- Dị ứng --- */}
      <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="warning" size={24} color="#EF4444" />
          <Text className="text-xl font-bold text-primary ml-3">Dị ứng</Text>
        </View>
        {healthProfile.allergies.length > 0 ? (
          healthProfile.allergies.map((item, index) => (
            <View key={index} className="bg-red-50 p-3 rounded-lg mb-2">
              <Text className="font-semibold text-red-800">
                Loại: {item.type}
              </Text>
              <Text className="text-red-700">Phản ứng: {item.reaction}</Text>
              <Text className="text-red-700">Mức độ: {item.severity}</Text>
              {item.notes && (
                <Text className="text-red-600 italic">
                  Ghi chú: {item.notes}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text className="text-gray-600">Không có thông tin dị ứng.</Text>
        )}
      </View>

      {/* --- Bệnh mạn tính --- */}
      <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="health-and-safety" size={24} color="#22C55E" />
          <Text className="text-xl font-bold text-primary ml-3">
            Bệnh mãn tính
          </Text>
        </View>
        {healthProfile.chronicConditions.length > 0 ? (
          healthProfile.chronicConditions.map((item, index) => (
            <View key={index} className="bg-green-50 p-3 rounded-lg mb-2">
              <Text className="font-semibold text-green-800">
                {item.conditionName}
              </Text>
              <Text className="text-green-700">
                Ngày chẩn đoán:{" "}
                {item.diagnosedDate
                  ? dayjs(item.diagnosedDate).format("DD/MM/YYYY")
                  : "--"}
              </Text>
              <Text className="text-green-700">Thuốc: {item.medication}</Text>
              <Text className="text-green-600 italic">{item.notes}</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-600">Không có bệnh mạn tính.</Text>
        )}
      </View>

      {/* --- Tiền sử y tế --- */}
      <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="history" size={24} color="#3B82F6" />
          <Text className="text-xl font-bold text-primary ml-3">
            Tiền sử y tế
          </Text>
        </View>
        {healthProfile.medicalHistory.length > 0 ? (
          healthProfile.medicalHistory.map((item, index) => (
            <View key={index} className="bg-blue-50 p-3 rounded-lg mb-2">
              <Text className="font-semibold text-blue-800">
                {item.condition}
              </Text>
              <Text className="text-blue-700">Cơ sở: {item.facility}</Text>
              <Text className="text-blue-700">
                Ngày điều trị: {dayjs(item.treatmentDate).format("DD/MM/YYYY")}
              </Text>
              <Text className="text-blue-700">Phương pháp: {item.method}</Text>
              {item.notes && (
                <Text className="text-blue-600 italic">{item.notes}</Text>
              )}
            </View>
          ))
        ) : (
          <Text className="text-gray-600">Không có tiền sử y tế.</Text>
        )}
      </View>

      {/* <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="visibility" size={24} color="#A855F7" />
          <Text className="text-xl font-bold text-primary ml-3">Khám mắt</Text>
        </View>
        {healthProfile.visionHistory.length > 0 ? (
          healthProfile.visionHistory.map((item, index) => (
            <View key={index} className="bg-purple-50 p-3 rounded-lg mb-2">
              <Text className="text-purple-800">
                Thị lực mắt phải: {item.rightEyeVision}
              </Text>
              <Text className="text-purple-800">
                Thị lực mắt trái: {item.leftEyeVision}
              </Text>
              <Text className="text-purple-700">
                Đeo kính: {item.wearsGlasses ? "Có" : "Không"}
              </Text>
              <Text className="text-purple-700">
                Mù màu: {item.isColorblind ? "Có" : "Không"}
              </Text>
              {item.notes && (
                <Text className="text-purple-600 italic">{item.notes}</Text>
              )}
            </View>
          ))
        ) : (
          <Text className="text-gray-600">Không có lịch sử khám mắt.</Text>
        )}
      </View>

      <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="hearing" size={24} color="#F59E0B" />
          <Text className="text-xl font-bold text-primary ml-3">Khám tai</Text>
        </View>
        {healthProfile.hearingHistory.length > 0 ? (
          healthProfile.hearingHistory.map((item, index) => (
            <View key={index} className="bg-yellow-50 p-3 rounded-lg mb-2">
              <Text className="text-yellow-800">
                Tai phải: {item.rightEarStatus}
              </Text>
              <Text className="text-yellow-800">
                Tai trái: {item.leftEarStatus}
              </Text>
              <Text className="text-yellow-700">
                Dùng máy trợ thính: {item.usesHearingAid ? "Có" : "Không"}
              </Text>
              {item.notes && (
                <Text className="text-yellow-600 italic">{item.notes}</Text>
              )}
            </View>
          ))
        ) : (
          <Text className="text-gray-600">Không có lịch sử khám tai.</Text>
        )}
      </View>

      <View className="px-6 py-6 pb-20">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="vaccines" size={24} color="#0EA5E9" />
          <Text className="text-xl font-bold text-primary ml-3">
            Lịch sử tiêm chủng
          </Text>
        </View>
        {healthProfile.vaccines.length > 0 ? (
          healthProfile.vaccines.map((item, index) => (
            <View key={index} className="bg-cyan-50 p-3 rounded-lg mb-2">
              <Text className="text-cyan-800">Vắc xin: {item.vaccineName}</Text>
              <Text className="text-cyan-800">Mũi số: {item.doseNumber}</Text>
              <Text className="text-cyan-700">Ghi chú: {item.note}</Text>
              <Text className="text-cyan-700">
                Ngày tiêm: {dayjs(item.dateInjected).format("DD/MM/YYYY")}
              </Text>
              <Text className="text-cyan-700">
                Nơi tiêm: {item.locationInjected}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-600">Không có lịch sử tiêm chủng.</Text>
        )}
      </View> */}
      
      <View className="px-6 mb-10">
        <Text className="text-center text-sm text-gray-500 italic">
          Để chỉnh sửa hồ sơ, vui lòng truy cập website
        </Text>
      </View>
    </ScrollView>
  );
}
