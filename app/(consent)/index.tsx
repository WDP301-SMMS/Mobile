import { useConsent } from "@/libs/hooks/useConsent";
import { useAppDispatch } from "@/libs/stores";
import { getConsent } from "@/libs/stores/consentManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ConsentScreen() {
  const dispatch = useAppDispatch();
  const { consents } = useConsent();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(getConsent());
  }, []);

  useEffect(() => {
    if (consents && consents.length > 0 && selectedStudentId === null) {
      setSelectedStudentId(consents[0].studentId);
    }
  }, [consents]);

  const selectedStudent = consents?.find(
    (student) => student.studentId === selectedStudentId
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
      <View className="bg-white pt-3 pb-2 mb-3 shadow-sm">
        <Text className="text-base font-semibold text-gray-700 px-4 mb-2">
          Chọn học sinh:
        </Text>
        {consents && consents.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, paddingLeft: 16 }}
          >
            {consents.map((item) => {
              const isSelected = item.studentId === selectedStudentId;
              return (
                <Pressable
                  key={item.studentId}
                  onPress={() => setSelectedStudentId(item.studentId)}
                  className={`flex-row items-center px-4 py-2 mr-3 rounded-full border ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 bg-gray-100"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 1,
                    elevation: 1,
                  }}
                >
                  <MaterialIcons
                    name="person"
                    size={18}
                    color={isSelected ? "rgb(37, 99, 235)" : "rgb(55, 65, 81)"}
                  />
                  <Text
                    numberOfLines={1}
                    className={`ml-2 text-base font-medium ${
                      isSelected ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {item.studentName}
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
      <ScrollView className="flex-1 px-4 py-4">
        {selectedStudent ? (
          <>
            <Text className="text-xl font-bold text-blue-800 mb-5">
              Đơn đồng ý của {selectedStudent.studentName}
            </Text>

            {selectedStudent.consents.length > 0 ? (
              selectedStudent.consents.map((consent) => {
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
                    onPress={() => router.push(`/(consent)/detail/${consent._id}`)}
                    className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-md flex-row items-center justify-between active:bg-gray-50"
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
                  Chưa có đơn nào cho học sinh này.
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
