import { useIncident } from "@/libs/hooks/useIncident";
import { useAppDispatch } from "@/libs/stores";
import { getIncidentDetail } from "@/libs/stores/incidentManager/thunk";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const severityMap: Record<string, { label: string; color: string }> = {
  Mild: { label: "Nhẹ", color: "text-green-600" },
  Moderate: { label: "Vừa", color: "text-yellow-600" },
  Severe: { label: "Nặng", color: "text-orange-600" },
  Critical: { label: "Nguy kịch", color: "text-red-600" },
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
    <Text className="text-gray-600 font-medium">{label}:</Text>
    <Text className="text-gray-800 flex-1 text-right ml-4">{value}</Text>
  </View>
);

export default function IncidentDetailScreen() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams();
  const { incidentDetail, loading } = useIncident();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(getIncidentDetail(id as string));
      }
    }, [dispatch, id])
  );

  const incident = incidentDetail;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 py-4">
        {loading ? (
          <View className="flex-1 justify-center items-center h-64">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-gray-600 text-lg">
              Đang tải dữ liệu...
            </Text>
          </View>
        ) : !incident ? (
          <View className="flex-1 justify-center items-center h-64">
            <Text className="text-gray-500 text-base italic">
              Không tìm thấy thông tin sự cố.
            </Text>
          </View>
        ) : (
          <>
            {/* Thông tin học sinh */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
              <Text className="text-xl font-bold text-blue-700 mb-3">
                Thông tin học sinh
              </Text>
              <DetailItem label="Họ tên" value={incident.studentId.fullName} />
              <DetailItem label="Lớp" value={incident.studentId.className} />
              <DetailItem label="ID sự cố" value={incident._id} />
            </View>

            {/* Thông tin sự cố */}
            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Chi tiết sự cố
              </Text>
              <DetailItem label="Loại sự cố" value={incident.incidentType} />
              <DetailItem label="Mô tả" value={incident.description} />
              <DetailItem
                label="Thời gian xảy ra"
                value={new Date(incident.incidentTime).toLocaleString()}
              />
              <DetailItem
                label="Nhân viên y tế"
                value={incident.nurseId.userName}
              />
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-600 font-medium">Mức độ:</Text>
                <Text
                  className={`font-semibold ${
                    severityMap[incident.severity]?.color || "text-gray-600"
                  }`}
                >
                  {severityMap[incident.severity]?.label || incident.severity}
                </Text>
              </View>
            </View>

            {/* Hành động đã xử lý */}
            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Hành động xử lý
              </Text>
              <Text className="text-base text-gray-700 leading-relaxed">
                {incident.actionsTaken || "Không có"}
              </Text>
            </View>

            {/* Ghi chú thêm */}
            {incident.note && (
              <View className="bg-white rounded-xl p-5 shadow">
                <Text className="text-xl font-bold text-gray-800 mb-3">
                  Ghi chú thêm
                </Text>
                <Text className="text-base text-gray-700 leading-relaxed">
                  {incident.note}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
