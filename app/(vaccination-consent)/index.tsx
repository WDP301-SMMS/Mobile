import { useConsent } from "@/libs/hooks/useConsent";
import { useHealthProfile } from "@/libs/hooks/useHealthProfile";
import { useAppDispatch } from "@/libs/stores";
import { getConsent } from "@/libs/stores/consentManager/thunk";
import { getMyChild } from "@/libs/stores/healthProfileManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
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

export default function ConsentScreen() {
  const dispatch = useAppDispatch();
  const { consents, loading } = useConsent(); // StudentConsentInfo[]
  const { myChild } = useHealthProfile(); // { _id, fullName }[]
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([dispatch(getConsent()), dispatch(getMyChild())]).finally(() =>
      setRefreshing(false)
    );
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getConsent());
      dispatch(getMyChild());
    }, [dispatch])
  );

  useEffect(() => {
    if (myChild && myChild.length > 0 && selectedStudentId === null) {
      setSelectedStudentId(myChild[0]._id);
    }
  }, [myChild]);

  const selectedConsentGroup = consents.find(
    (group) => group.studentId === selectedStudentId
  );

  const filteredConsents = selectedConsentGroup?.consents.filter(
    (consent) => selectedStatus === "ALL" || consent.status === selectedStatus
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
        {myChild && myChild.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, paddingLeft: 16 }}
          >
            {myChild.map((item) => {
              const isSelected = item._id === selectedStudentId;
              return (
                <Pressable
                  key={item._id}
                  onPress={() => setSelectedStudentId(item._id)}
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
                    {item.fullName}
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
      <View className="pt-3 pb-2 mb-3">
        <Text className="text-base font-semibold text-gray-700 px-4 mb-2">
          Chọn trạng thái:
        </Text>
        {selectedStudentId && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, paddingLeft: 16 }}
          >
            {statusFilters.map((status) => {
              const isSelected = selectedStatus === status.value;
              return (
                <Pressable
                  key={status.value}
                  onPress={() => setSelectedStatus(status.value)}
                  className={`flex-row items-center px-4 py-2 mr-3 rounded-full border ${
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
        )}
      </View>

      {/* Danh sách đơn */}
      <ScrollView
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedStudentId ? (
          <>
            <Text className="text-xl font-bold text-blue-800 mb-5">
              Đơn đồng ý của{" "}
              {myChild.find((s) => s._id === selectedStudentId)?.fullName}
            </Text>

            {filteredConsents && filteredConsents.length > 0 ? (
              filteredConsents.map((consent) => {
                const {
                  textColorClass,
                  bgColorClass,
                  iconName,
                  iconColorHex,
                  label,
                } = getStatusInfo(consent.status);

                return (
                  <Pressable
                    key={consent._id}
                    onPress={() =>
                      router.push(
                        `/(vaccination-consent)/detail/${consent._id}`
                      )
                    }
                    className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-md flex-row items-center justify-between"
                  >
                    <View className="flex-1 pr-4">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {consent.campaignId.name}
                      </Text>
                      <View className="flex-row items-center mb-2">
                        <MaterialIcons
                          name="vaccines"
                          size={16}
                          color={"rgb(55, 65, 81)"}
                        />
                        <Text className="text-base text-gray-700 ml-1">
                          {consent.campaignId.vaccineName} (Mũi{" "}
                          {consent.campaignId.doseNumber})
                        </Text>
                      </View>
                      <View
                        className={`px-3 py-1 rounded-full ${bgColorClass} self-start flex-row items-center`}
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
              <View className="flex-1 justify-center items-center mt-10 p-5 bg-white rounded-xl shadow-sm">
                <MaterialIcons
                  name="sentiment-neutral"
                  size={48}
                  color={"rgb(107, 114, 128)"}
                />
                <Text className="text-base italic text-gray-500 mt-3 text-center">
                  Không có đơn nào với trạng thái đã chọn.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View className="flex-1 justify-center items-center mt-20 p-5 bg-white rounded-xl shadow-sm">
            <MaterialIcons
              name="info-outline"
              size={48}
              color={"rgb(107, 114, 128)"}
            />
            <Text className="text-base italic text-gray-500 mt-3 text-center">
              Vui lòng chọn học sinh để xem thông tin chi tiết đơn.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
