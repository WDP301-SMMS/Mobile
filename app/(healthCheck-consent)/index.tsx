import { useHealthCheck } from "@/libs/hooks/useHealthCheck";
import { useAppDispatch } from "@/libs/stores";
import { getHealthCheckConsent } from "@/libs/stores/healthCheckManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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

export default function ConsentScreen() {
  const dispatch = useAppDispatch();
  const { consents } = useHealthCheck();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  useEffect(() => {
    dispatch(getHealthCheckConsent());
  }, []);

  useEffect(() => {
    if (consents && consents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(consents[0].studentId._id);
    }
  }, [consents]);

  const filteredConsentsByStudent = consents?.filter(
    (consent) => consent.studentId._id === selectedStudentId
  );

  const filteredConsents = filteredConsentsByStudent?.filter((c) =>
    selectedStatus === "ALL" ? true : c.status === selectedStatus
  );

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          textColorClass: "text-green-700",
          bgColorClass: "bg-green-100",
          iconColorHex: "rgb(21, 128, 61)",
          iconName: "check-circle",
          label: "Đồng ý",
        };
      case "DECLINED":
        return {
          textColorClass: "text-red-700",
          bgColorClass: "bg-red-100",
          iconColorHex: "rgb(185, 28, 28)",
          iconName: "cancel",
          label: "Từ chối",
        };
      case "COMPLETED":
        return {
          textColorClass: "text-blue-800",
          bgColorClass: "bg-blue-100",
          iconColorHex: "rgb(30, 64, 175)",
          iconName: "task-alt",
          label: "Đã hoàn tất",
        };
      case "REVOKED":
        return {
          textColorClass: "text-gray-700",
          bgColorClass: "bg-gray-100",
          iconColorHex: "rgb(75, 85, 99)",
          iconName: "block",
          label: "Đã thu hồi",
        };
      case "UNDER_OBSERVATION":
        return {
          textColorClass: "text-yellow-700",
          bgColorClass: "bg-yellow-100",
          iconColorHex: "rgb(202, 138, 4)",
          iconName: "visibility",
          label: "Đang theo dõi",
        };
      case "ADVERSE_REACTION":
        return {
          textColorClass: "text-pink-700",
          bgColorClass: "bg-pink-100",
          iconColorHex: "rgb(190, 24, 93)",
          iconName: "warning",
          label: "Phản ứng phụ",
        };
      case "PENDING":
      default:
        return {
          textColorClass: "text-yellow-700",
          bgColorClass: "bg-yellow-100",
          iconColorHex: "rgb(161, 98, 7)",
          iconName: "hourglass-empty",
          label: "Chờ chấp thuận",
        };
    }
  };

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
          {consents?.map((item) => {
            const isSelected = item.studentId._id === selectedStudentId;
            return (
              <Pressable
                key={item.studentId._id}
                onPress={() => setSelectedStudentId(item.studentId._id)}
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
                  {item.studentId.fullName}
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
        {filteredConsents && filteredConsents.length > 0 ? (
          filteredConsents.map((consent) => {
            const {
              iconColorHex,
              iconName,
              label,
              bgColorClass,
              textColorClass,
            } = getStatusInfo(consent.status);

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
                    className={`px-3 py-1 rounded-full ${bgColorClass} flex-row items-center w-fit`}
                  >
                    <MaterialIcons
                      name={iconName as any}
                      size={16}
                      color={iconColorHex}
                    />
                    <Text
                      className={`ml-1 text-sm font-semibold ${textColorClass}`}
                    >
                      {label}
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
                  color={"rgb(107, 114, 128)"}
                />
              </Pressable>
            );
          })
        ) : (
          <View className="mt-10 p-5 bg-white rounded-xl items-center">
            <MaterialIcons
              name="sentiment-neutral"
              size={48}
              color={"rgb(107, 114, 128)"}
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
