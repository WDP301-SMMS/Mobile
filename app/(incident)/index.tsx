import { useHealthProfile } from "@/libs/hooks/useHealthProfile";
import { useIncident } from "@/libs/hooks/useIncident";
import { useAppDispatch } from "@/libs/stores";
import { getMyChild } from "@/libs/stores/healthProfileManager/thunk";
import { resetIncidents } from "@/libs/stores/incidentManager/slice";
import { getAllIncident } from "@/libs/stores/incidentManager/thunk";
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
  View,
} from "react-native";

const severityFilters = [
  { value: null, label: "Tất cả" },
  { value: "Mild", label: "Nhẹ" },
  { value: "Moderate", label: "Vừa" },
  { value: "Severe", label: "Nặng" },
  { value: "Critical", label: "Nguy kịch" },
];

const severityColors: Record<string, string> = {
  Mild: "text-green-600",
  Moderate: "text-yellow-600",
  Severe: "text-orange-600",
  Critical: "text-red-600",
};

export default function IncidentScreen() {
  const dispatch = useAppDispatch();
  const { incidents, loading, hasMore, page: currentPage } = useIncident();
  const { myChild } = useHealthProfile();
  const router = useRouter();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [limit] = useState(10);

  const fetchData = useCallback(
    (pageToFetch = 1, shouldReset = false) => {
      if (!selectedStudentId) return;
      if (shouldReset) {
        dispatch(resetIncidents());
      }
      dispatch(
        getAllIncident({
          studentId: selectedStudentId,
          severity: selectedSeverity || undefined,
          page: pageToFetch,
          limit,
        })
      );
    },
    [dispatch, selectedStudentId, selectedSeverity, limit]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getMyChild()).then(() => {
      dispatch(resetIncidents());
      fetchData(1);
      setRefreshing(false);
    });
  }, [dispatch, fetchData]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyChild());
      if (selectedStudentId) {
        dispatch(resetIncidents());
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

  const handleSelectSeverity = (value: string | null) => {
    setSelectedSeverity(value);
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

  const hasIncidents = Array.isArray(incidents) && incidents.length > 0;
  const selectedStudent = myChild.find((s) => s._id === selectedStudentId);

  if (loading && !hasIncidents) {
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

      {/* Chọn mức độ */}
      <View className="pt-3 pb-2 mb-3">
        <Text className="text-base font-semibold text-gray-700 px-4 mb-2">
          Chọn mức độ:
        </Text>
        {selectedStudentId && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {severityFilters.map((s) => {
              const isSelected = selectedSeverity === s.value;
              return (
                <Pressable
                  key={s.label}
                  onPress={() => handleSelectSeverity(s.value)}
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

      {/* Danh sách sự cố */}
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
              Sự cố của {selectedStudent?.fullName ?? "Học sinh không xác định"}
            </Text>

            {hasIncidents ? (
              <>
                {incidents.map((incident, idx) => {
                  const severityColor =
                    severityColors[incident.severity] ?? "text-gray-600";
                  const severityLabel =
                    severityFilters.find((s) => s.value === incident.severity)
                      ?.label || incident.severity;

                  return (
                    <Pressable
                      key={incident._id ?? idx}
                      className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-md"
                      onPress={() =>
                        router.push(`/(incident)/detail/${incident._id}`)
                      }
                    >
                      <View className="flex-row justify-between items-center">
                        <View className="flex-1 pr-2">
                          <Text className="text-lg font-semibold text-gray-900 mb-1">
                            {incident.incidentType}
                          </Text>
                          <Text className="text-base text-gray-700 mb-2">
                            {incident.description}
                          </Text>
                          <Text className={`text-sm italic ${severityColor}`}>
                            Mức độ: {severityLabel}
                          </Text>
                        </View>
                        <MaterialIcons
                          name="chevron-right"
                          size={24}
                          color="rgb(107, 114, 128)"
                        />
                      </View>
                    </Pressable>
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
                  name="sentiment-neutral"
                  size={48}
                  color="rgb(107, 114, 128)"
                />
                <Text className="text-base italic text-gray-500 mt-3 text-center">
                  Không có sự cố nào với lựa chọn đã chọn.
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
              Vui lòng chọn học sinh để xem thông tin sự cố.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
