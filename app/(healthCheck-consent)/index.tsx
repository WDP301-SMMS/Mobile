import { useHealthCheck } from "@/libs/hooks/useHealthCheck";
import { useHealthProfile } from "@/libs/hooks/useHealthProfile";
import { useAppDispatch } from "@/libs/stores";
import { getHealthCheckConsent } from "@/libs/stores/healthCheckManager/thunk";
import { getMyChild } from "@/libs/stores/healthProfileManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const statusFilters = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ chấp thuận" },
  { value: "APPROVED", label: "Đồng ý" },
  { value: "DECLINED", label: "Từ chối" },
  { value: "COMPLETED", label: "Đã hoàn tất" },
  { value: "REVOKED", label: "Đã thu hồi" },
  { value: "UNDER_OBSERVATION", label: "Đang theo dõi" },
  { value: "ADVERSE_REACTION", label: "Phản ứng phụ" },
];

const statusMap: Record<
  string,
  {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    textColor: string;
    bgColor: string;
    iconColor: string;
  }
> = {
  APPROVED: {
    label: "Đồng ý",
    icon: "check-circle",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
    iconColor: "rgb(21, 128, 61)",
  },
  DECLINED: {
    label: "Từ chối",
    icon: "cancel",
    textColor: "text-red-700",
    bgColor: "bg-red-100",
    iconColor: "rgb(185, 28, 28)",
  },
  COMPLETED: {
    label: "Đã hoàn tất",
    icon: "task-alt",
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
    iconColor: "rgb(30, 64, 175)",
  },
  REVOKED: {
    label: "Đã thu hồi",
    icon: "block",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
    iconColor: "rgb(75, 85, 99)",
  },
  UNDER_OBSERVATION: {
    label: "Đang theo dõi",
    icon: "visibility",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-100",
    iconColor: "rgb(202, 138, 4)",
  },
  ADVERSE_REACTION: {
    label: "Phản ứng phụ",
    icon: "warning",
    textColor: "text-pink-700",
    bgColor: "bg-pink-100",
    iconColor: "rgb(190, 24, 93)",
  },
  PENDING: {
    label: "Chờ chấp thuận",
    icon: "hourglass-empty",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-100",
    iconColor: "rgb(161, 98, 7)",
  },
};

export default function ConsentScreen() {
  const dispatch = useAppDispatch();
  const { consents, loading } = useHealthCheck();
  const { myChild } = useHealthProfile();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  useFocusEffect(
    useCallback(() => {
      dispatch(getHealthCheckConsent());
      dispatch(getMyChild());
    }, [dispatch])
  );

  useEffect(() => {
    if (consents?.length && !selectedStudentId) {
      setSelectedStudentId(consents[0].studentId._id);
    }
  }, [consents]);

  const filtered = consents?.filter(
    (c) =>
      c.studentId._id === selectedStudentId &&
      (selectedStatus === "ALL" || c.status === selectedStatus)
  );

  if (loading) {
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
          contentContainerStyle={{ paddingRight: 16, paddingLeft: 16 }}
        >
          {myChild.map((child) => {
            const isSelected = child._id === selectedStudentId;
            return (
              <Pressable
                key={child._id}
                onPress={() => setSelectedStudentId(child._id)}
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
      <View className="pb-2 mb-3">
        <Text className="text-base font-semibold text-gray-700 px-4 mb-2">
          Chọn trạng thái:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16, paddingLeft: 16 }}
        >
          {statusFilters.map((status) => {
            const isSelected = status.value === selectedStatus;
            return (
              <Pressable
                key={status.value}
                onPress={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 mr-3 rounded-full border ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  {status.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Danh sách đơn */}
      <ScrollView className="px-4">
        {filtered?.length ? (
          filtered.map((consent) => {
            const s = statusMap[consent.status] || {
              label: consent.status,
              icon: "help-outline",
              textColor: "text-gray-700",
              bgColor: "bg-gray-100",
              iconColor: "gray",
            };

            return (
              <Pressable
                key={consent._id}
                onPress={() =>
                  router.push(`/(healthCheck-consent)/detail/${consent._id}`)
                }
                className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {consent.campaignId.name}
                  </Text>
                  <Text className="text-base text-gray-700 mb-2">
                    {consent.campaignId.schoolYear}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${s.bgColor} flex-row items-center w-fit`}
                  >
                    <MaterialIcons
                      name={s.icon as any}
                      size={16}
                      color={s.iconColor}
                    />
                    <Text
                      className={`ml-1 text-sm font-semibold ${s.textColor}`}
                    >
                      {s.label}
                    </Text>
                  </View>

                  {consent.status === "DECLINED" &&
                    consent.reasonForDeclining && (
                      <View className="mt-3 border-t border-gray-100 pt-2">
                        <View className="flex-row items-center">
                          <MaterialIcons
                            name="note-alt"
                            size={16}
                            color="rgb(185, 28, 28)"
                          />
                          <Text className="ml-1 text-sm text-gray-600 italic">
                            Lý do từ chối: {consent.reasonForDeclining}
                          </Text>
                        </View>
                      </View>
                    )}
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color="rgb(107, 114, 128)"
                />
              </Pressable>
            );
          })
        ) : (
          <View className="mt-10 p-5 bg-white rounded-xl items-center">
            <MaterialIcons
              name="sentiment-neutral"
              size={48}
              color="rgb(107, 114, 128)"
            />
            <Text className="text-base italic text-gray-500 mt-3 text-center">
              Không có đơn phù hợp với bộ lọc hiện tại.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
