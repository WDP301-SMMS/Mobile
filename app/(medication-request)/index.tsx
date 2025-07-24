import { useHealthProfile } from "@/libs/hooks/useHealthProfile";
import { useRequest } from "@/libs/hooks/useRequest";
import { useAppDispatch } from "@/libs/stores";
import { getMyChild } from "@/libs/stores/healthProfileManager/thunk";
import { resetRequests } from "@/libs/stores/requestManager/slice";
import { getAllRequest } from "@/libs/stores/requestManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "text-yellow-600";
    case "Scheduled":
      return "text-blue-600";
    case "In_progress":
      return "text-purple-600";
    case "Completed":
      return "text-green-600";
    case "Cancelled":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const statusFilters = [
  { value: null, label: "Tất cả" },
  { value: "Pending", label: "Chờ xác nhận" },
  { value: "Scheduled", label: "Đã lên lịch" },
  { value: "In_progress", label: "Đang thực hiện" },
  { value: "Completed", label: "Hoàn tất" },
  { value: "Cancelled", label: "Đã hủy" },
];

export default function MedicationScheduleScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { myChild } = useHealthProfile();
  const { requests, loading, hasMore, page: currentPage } = useRequest();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isPickingStart, setIsPickingStart] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [limit] = useState(10);

  const fetchData = useCallback(
    (pageToFetch = 1, shouldReset = false) => {
      if (!selectedStudentId) return;
      if (shouldReset) dispatch(resetRequests());

      dispatch(
        getAllRequest({
          studentId: selectedStudentId,
          status: selectedStatus || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page: pageToFetch,
          limit,
        })
      );
    },
    [dispatch, selectedStudentId, selectedStatus, startDate, endDate, limit]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getMyChild()).then(() => {
      dispatch(resetRequests());
      fetchData(1);
      setRefreshing(false);
    });
  }, [dispatch, fetchData]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyChild());
      if (selectedStudentId) {
        dispatch(resetRequests());
        fetchData(1);
      }
    }, [dispatch, selectedStudentId, fetchData])
  );

  useEffect(() => {
    if (myChild?.length && !selectedStudentId) {
      setSelectedStudentId(myChild[0]._id);
    }
  }, [myChild]);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    fetchData(1, true);
  };

  const handleSelectStatus = (value: string | null) => {
    setSelectedStatus(value);
    fetchData(1, true);
  };

  const showStartDatePicker = () => {
    setIsPickingStart(true);
    setDatePickerVisible(true);
  };

  const showEndDatePicker = () => {
    setIsPickingStart(false);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirmDate = (date: any) => {
    if (isPickingStart) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    hideDatePicker();
    fetchData(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      setLoadingMore(true);
      fetchData(currentPage + 1);
      setLoadingMore(false);
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    if (isCloseToBottom) handleLoadMore();
  };

  const hasRequests = Array.isArray(requests) && requests.length > 0;
  const selectedStudent = myChild.find((s) => s._id === selectedStudentId);

  const formatDate = (date: any) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  if (loading && !hasRequests) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-gray-600">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Chọn học sinh */}
      <View className="pt-3 pb-2 mb-3">
        <Text className="text-base font-semibold text-gray-700 px-4 mb-2">
          Chọn học sinh:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {myChild.map((child) => {
            const isSelected = child._id === selectedStudentId;
            return (
              <Pressable
                key={child._id}
                onPress={() => handleSelectStudent(child._id)}
                className={`flex-row items-center px-4 py-2 mr-3 rounded-full border ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                <MaterialIcons
                  name="person"
                  size={18}
                  color={isSelected ? "rgb(37, 99, 235)" : "rgb(55, 65, 81)"}
                />
                <Text
                  className={`ml-2 text-base font-medium ${
                    isSelected ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  {child.fullName}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Chọn trạng thái */}
      <View className="pt-3 pb-2 mb-3">
        <Text className="text-base font-semibold text-gray-700 px-4 mb-2">
          Chọn trạng thái:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {statusFilters.map((s) => {
            const isSelected = selectedStatus === s.value;
            return (
              <Pressable
                key={s.label}
                onPress={() => handleSelectStatus(s.value)}
                className={`flex-row items-center px-4 py-2 mr-3 rounded-full border ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className="px-4 pb-2">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-base font-semibold text-gray-700">
            Chọn khoảng ngày:
          </Text>
          {(startDate || endDate) && (
            <Pressable
              onPress={() => {
                setStartDate(null);
                setEndDate(null);
                fetchData(1, true);
              }}
            >
              <Text className="text-sm text-blue-600 font-medium">
                Xóa ngày
              </Text>
            </Pressable>
          )}
        </View>
        <View className="flex-row">
          <Pressable
            onPress={showStartDatePicker}
            className="flex-1 py-2 px-3 mr-2 bg-white rounded-md border border-gray-300"
          >
            <Text className="text-gray-700">
              {startDate ? formatDate(startDate) : "Từ ngày"}
            </Text>
          </Pressable>

          <Pressable
            onPress={showEndDatePicker}
            className="flex-1 py-2 px-3 bg-white rounded-md border border-gray-300"
          >
            <Text className="text-gray-700">
              {endDate ? formatDate(endDate) : "Đến ngày"}
            </Text>
          </Pressable>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      {/* Danh sách yêu cầu */}
      <ScrollView
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={onScroll}
        scrollEventThrottle={400}
      >
        {selectedStudentId ? (
          <>
            <Text className="text-xl font-bold text-blue-800 mb-5">
              Yêu cầu của {selectedStudent?.fullName}
            </Text>

            {hasRequests ? (
              <>
                {requests.map((req) => (
                  <TouchableOpacity
                    key={req._id}
                    className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-md"
                    onPress={() =>
                      router.push(`/(medication-request)/schedule/${req._id}`)
                    }
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1 pr-2">
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                          Từ ngày {new Date(req.startDate).toLocaleDateString()}{" "}
                          đến {new Date(req.endDate).toLocaleDateString()}
                        </Text>
                        <Text className="text-base text-gray-700">
                          {req.requestItems?.length ?? 0} loại thuốc - Trạng
                          thái:{" "}
                          <Text
                            className={`${getStatusColor(
                              req.status
                            )} font-semibold`}
                          >
                            {statusFilters.find((s) => s.value === req.status)
                              ?.label || req.status}
                          </Text>
                        </Text>
                      </View>

                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color="rgb(107, 114, 128)"
                      />
                    </View>
                  </TouchableOpacity>
                ))}

                {loadingMore && (
                  <View className="items-center justify-center py-4">
                    <ActivityIndicator size="small" color="#2563EB" />
                  </View>
                )}
              </>
            ) : (
              <View className="flex-1 justify-center items-center mt-10 p-5 bg-white rounded-xl shadow-sm">
                <MaterialIcons
                  name="sentiment-neutral"
                  size={48}
                  color="rgb(107, 114, 128)"
                />
                <Text className="text-base italic text-gray-500 mt-3 text-center">
                  Không có yêu cầu nào với lựa chọn đã chọn.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View className="flex-1 justify-center items-center mt-20 p-5 bg-white rounded-xl shadow-sm">
            <MaterialIcons
              name="info-outline"
              size={48}
              color="rgb(107, 114, 128)"
            />
            <Text className="text-base italic text-gray-500 mt-3 text-center">
              Vui lòng chọn học sinh để xem thông tin yêu cầu.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
