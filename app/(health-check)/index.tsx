import { useHealthProfile } from "@/libs/hooks/useHealthProfile";
import { useAppDispatch } from "@/libs/stores";
import {
  getMyChild,
  studentHealthHistory,
} from "@/libs/stores/healthProfileManager/thunk";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const schoolYearList = ["2024-2025", "2023-2024", "2022-2023"];

export default function MedicalResultScreen() {
  const dispatch = useAppDispatch();
  const { loading, myChild, healthHistory } = useHealthProfile();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string | null>(
    null
  );
  const [fetching, setFetching] = useState(false);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    date.setHours(date.getHours());

    const pad = (n: number) => (n < 10 ? `0${n}` : n);

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyChild());
    }, [dispatch])
  );

  useEffect(() => {
    if (selectedStudentId && selectedSchoolYear) {
      setFetching(true);
      dispatch(
        studentHealthHistory({
          studentId: selectedStudentId,
          schoolYear: selectedSchoolYear,
        })
      ).finally(() => setFetching(false));
    }
  }, [selectedStudentId, selectedSchoolYear, dispatch]);

  const selectedStudent = myChild.find((s) => s._id === selectedStudentId);

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-4">
        <Text className="font-semibold text-gray-700 mb-2">Chọn học sinh:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {myChild.map((child) => {
            const isSelected = child._id === selectedStudentId;
            return (
              <Pressable
                key={child._id}
                onPress={() => setSelectedStudentId(child._id)}
                className={`px-4 py-2 mr-3 rounded-full border ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                <Text
                  className={`${
                    isSelected ? "text-blue-700" : "text-gray-700"
                  } font-medium`}
                >
                  {child.fullName}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Chọn năm học */}
      <View className="px-4 pt-4">
        <Text className="font-semibold text-gray-700 mb-2">Chọn năm học:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {schoolYearList.map((year) => {
            const isSelected = year === selectedSchoolYear;
            return (
              <Pressable
                key={year}
                onPress={() => setSelectedSchoolYear(year)}
                className={`px-4 py-2 mr-3 rounded-full border ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                <Text
                  className={`${
                    isSelected ? "text-blue-700" : "text-gray-700"
                  } font-medium`}
                >
                  {year}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Kết quả */}
      <ScrollView className="flex-1 px-4 pt-5 pb-10">
        {fetching ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="mt-2 text-gray-500">Đang tải kết quả khám...</Text>
          </View>
        ) : selectedStudent && selectedSchoolYear && healthHistory ? (
          <>

            {healthHistory.healthChecks.map((check, idx) => (
              <View
                key={idx}
                className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <Text className="font-semibold text-gray-800 text-base mb-1">
                  {check.campaignName} - {check.className}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Ngày khám: {formatDateTime(check.checkupDate)}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Kết luận: {check.overallConclusion}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Khuyến nghị: {check.recommendations}
                </Text>
                <Text className="text-sm text-gray-500 italic mb-2">
                  Điều dưỡng: {check.nurseName}
                </Text>

                {check.details.map((detail, i) => (
                  <View
                    key={i}
                    className="pl-2 ml-1 border-l border-gray-300 mb-1"
                  >
                    <Text className="text-sm text-gray-700">
                      - {detail.itemName}: {detail.value} {detail.unit}{" "}
                      {detail.isAbnormal ? "(Bất thường)" : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        ) : (
          <Text className="text-center text-gray-500 italic mt-10">
            Vui lòng chọn học sinh và năm học để xem kết quả khám sức khỏe.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
