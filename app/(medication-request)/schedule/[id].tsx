import { MedicationCalendar } from "@/components/schedule/MedicationCalendar";
import { useRequest } from "@/libs/hooks/useRequest";
import { useAppDispatch } from "@/libs/stores";
import {
    getRequestDetail,
    getRequestSchedule,
} from "@/libs/stores/requestManager/thunk";
import * as Linking from "expo-linking";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const requestStatusMap: Record<
  string,
  { label: string; color: string }
> = {
  Pending: { label: "Chờ duyệt", color: "text-yellow-500" },
  Scheduled: { label: "Đã lên lịch", color: "text-blue-500" },
  In_progress: { label: "Đang thực hiện", color: "text-indigo-600" },
  Completed: { label: "Hoàn thành", color: "text-green-600" },
  Cancelled: { label: "Đã huỷ", color: "text-gray-500" },
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
    <Text className="text-gray-600 font-medium">{label}:</Text>
    <Text className="text-gray-800 flex-1 text-right ml-4">{value}</Text>
  </View>
);

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { requestDetail, requestSchedule, loading } = useRequest();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(getRequestDetail(id as string));
        dispatch(getRequestSchedule(id as string));
      }
    }, [dispatch, id])
  );

  const request = requestDetail;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading || !request ? (
        <View className="flex-1 justify-center items-center h-64">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-4 text-gray-600 text-lg">
            Đang tải dữ liệu...
          </Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {/* Thông tin học sinh */}
              <View className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
                <Text className="text-xl font-bold text-blue-700 mb-3">
                  Thông tin học sinh
                </Text>
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600 font-medium">Tình trạng:</Text>
                  <Text
                    className={`font-semibold ${
                      requestStatusMap[request.status]?.color || "text-gray-600"
                    }`}
                  >
                    {requestStatusMap[request.status]?.label || request.status}
                  </Text>
                </View>
                <DetailItem
                  label="Thời gian dùng thuốc"
                  value={`${new Date(request.startDate).toLocaleDateString(
                    "vi-VN"
                  )} - ${new Date(request.endDate).toLocaleDateString(
                    "vi-VN"
                  )}`}
                />
              </View>

              {/* Thông tin yêu cầu */}
              <View className="bg-white rounded-xl p-5 mb-6 shadow">
                <Text className="text-xl font-bold text-gray-800 mb-3">
                  Chi tiết yêu cầu
                </Text>
                <DetailItem
                  label="Người yêu cầu"
                  value={request.parentId.username}
                />
                <DetailItem
                  label="Tình trạng"
                  value={
                    requestStatusMap[request.status]?.label || request.status
                  }
                />
                {request.prescriptionFile && (
                  <View className="pt-2">
                    <Text className="text-gray-600 font-medium">
                      File đơn thuốc:
                    </Text>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(request.prescriptionFile)}
                    >
                      <Text className="text-blue-600 underline mt-1">
                        Tải xuống đơn thuốc
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Danh sách thuốc */}
              <View className="bg-white rounded-xl p-5 mb-6 shadow">
                <Text className="text-xl font-bold text-gray-800 mb-3">
                  Danh sách thuốc
                </Text>
                {request.requestItems?.map((item) => (
                  <View
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-3 mb-3"
                  >
                    <DetailItem label="Tên thuốc" value={item.medicationName} />
                    <DetailItem label="Liều dùng" value={item.dosage} />
                    <DetailItem label="Hướng dẫn" value={item.instruction} />
                  </View>
                ))}
              </View>
            </>
          }
          data={[{ key: "calendar" }]}
          renderItem={() => (
            <MedicationCalendar schedules={requestSchedule || []} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
