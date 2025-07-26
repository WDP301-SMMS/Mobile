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

export default function VaccinationHistoryScreen() {
  const dispatch = useAppDispatch();
  const { myChild, healthHistory } = useHealthProfile();
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

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string | null>(
    null
  );
  const [fetching, setFetching] = useState(false);

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
      {/* Chọn học sinh */}
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
            <Text className="mt-2 text-gray-500">
              Đang tải lịch sử tiêm chủng...
            </Text>
          </View>
        ) : selectedStudent && selectedSchoolYear && healthHistory ? (
          <>
            {healthHistory.vaccinations.map((vaccine, idx) => (
              <View
                key={idx}
                className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <Text className="font-semibold text-gray-800 text-base mb-1">
                  {vaccine.campaignName} - {vaccine.vaccineName} (Mũi{" "}
                  {vaccine.doseNumber})
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Ngày tiêm: {formatDateTime(vaccine.administeredAt)}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Tiêm bởi: {vaccine.administeredBy}
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  Đơn vị thực hiện: {vaccine.organizationName}
                </Text>

                {vaccine.observations.length > 0 && (
                  <>
                    <Text className="text-sm text-gray-700 font-medium mb-1">
                      Theo dõi sau tiêm:
                    </Text>
                    {vaccine.observations.map((obs, i) => (
                      <View
                        key={i}
                        className="pl-2 ml-1 border-l border-gray-300 mb-1"
                      >
                        <Text className="text-sm text-gray-700">
                          - {formatDateTime(obs.observedAt)}: {obs.notes}{" "}
                          {obs.isAbnormal ? "(Bất thường)" : ""}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            ))}
          </>
        ) : (
          <Text className="text-center text-gray-500 italic mt-10">
            Vui lòng chọn học sinh và năm học để xem lịch sử tiêm chủng.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
