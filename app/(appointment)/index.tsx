import { useAppointment } from "@/libs/hooks/useAppointment";
import { useHealthProfile } from "@/libs/hooks/useHealthProfile";
import { useAppDispatch } from "@/libs/stores";
import { resetAppointments } from "@/libs/stores/appointmentManager/slice";
import { getAllAppointment } from "@/libs/stores/appointmentManager/thunk";
import { getMyChild } from "@/libs/stores/healthProfileManager/thunk";
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

// Danh sách filter trạng thái (status) với nhãn Việt hóa
const statusFilters = [
  { value: null, label: "Tất cả" },
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "APPROVED", label: "Đã xác nhận" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

// Gán màu cho mỗi trạng thái
const statusColors: Record<string, string> = {
  SCHEDULED: "text-blue-600",
  APPROVED: "text-purple-600",
  COMPLETED: "text-green-600",
  CANCELLED: "text-red-600",
};

export default function AppointmentScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    appointments,
    loading,
    hasMore,
    page: currentPage,
  } = useAppointment();
  const { myChild } = useHealthProfile();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [limit] = useState(10);

  const fetchData = useCallback(
    (pageToFetch = 1, shouldReset = false) => {
      if (!selectedStudentId) return;
      if (shouldReset) {
        dispatch(resetAppointments());
      }
      dispatch(
        getAllAppointment({
          studentId: selectedStudentId,
          status: selectedStatus || undefined,
          page: pageToFetch,
          limit,
        })
      );
    },
    [dispatch, selectedStudentId, selectedStatus, limit]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getMyChild()).then(() => {
      dispatch(resetAppointments());
      fetchData(1);
      setRefreshing(false);
    });
  }, [dispatch, fetchData]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyChild());
      if (selectedStudentId) {
        dispatch(resetAppointments());
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

  const handleSelectStatus = (status: string | null) => {
    setSelectedStatus(status);
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
    if (isCloseToBottom) {
      handleLoadMore();
    }
  };

  const selectedStudent = myChild.find((s) => s._id === selectedStudentId);
  const hasAppointments =
    Array.isArray(appointments) && appointments.length > 0;

  if (loading && !hasAppointments) {
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
        {myChild?.length ? (
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
        ) : (
          <View className="px-4 pb-2">
            <Text className="text-base italic text-gray-500">
              Bạn chưa có học sinh nào được liên kết.
            </Text>
          </View>
        )}
      </View>

      {/* Chọn trạng thái */}
      <View className="pt-1 pb-3">
        <Text className="text-base font-semibold text-gray-700 px-4 mb-2">
          Chọn trạng thái:
        </Text>
        {selectedStudentId && (
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
        )}
      </View>

      {/* Danh sách lịch hẹn */}
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
              Lịch hẹn của{" "}
              {selectedStudent?.fullName ?? "Học sinh không xác định"}
            </Text>

            {hasAppointments ? (
              <>
                {appointments.map((a, idx) => {
                  const colorClass = statusColors[a.status] ?? "text-gray-600";
                  const statusLabel =
                    statusFilters.find((s) => s.value === a.status)?.label ||
                    a.status;

                  return (
                    <TouchableOpacity
                      key={a._id ?? idx}
                      className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-md"
                      onPress={() =>
                        router.push(`/(appointment)/detail/${a._id}`)
                      }
                    >
                      <View className="flex-row justify-between items-center">
                        <View className="flex-1 pr-2">
                          <Text className="text-lg font-semibold text-gray-900 mb-1">
                            {new Date(a.meetingTime).toLocaleString("vi-VN")}
                          </Text>
                          <Text className="text-base text-gray-700 mb-1">
                            Địa điểm: {a.location}
                          </Text>
                          <Text className={`text-sm italic ${colorClass}`}>
                            Trạng thái: {statusLabel}
                          </Text>
                          {a.notes ? (
                            <Text className="text-sm text-gray-500 mt-1">
                              Ghi chú: {a.notes}
                            </Text>
                          ) : null}
                        </View>

                        <MaterialIcons
                          name="chevron-right"
                          size={24}
                          color="rgb(107, 114, 128)"
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {loadingMore && (
                  <View className="items-center justify-center py-4">
                    <ActivityIndicator size="small" color="#2563EB" />
                  </View>
                )}
              </>
            ) : (
              <View className="flex-1 justify-center items-center mt-10 p-5 bg-white rounded-xl shadow-sm">
                <MaterialIcons
                  name="event-busy"
                  size={48}
                  color="rgb(107, 114, 128)"
                />
                <Text className="text-base italic text-gray-500 mt-3 text-center">
                  Không có lịch hẹn nào được tìm thấy.
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
              Vui lòng chọn học sinh để xem lịch hẹn.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
