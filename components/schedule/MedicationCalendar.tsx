import { MedicationSchedule } from "@/libs/types/request";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

interface Props {
  schedules: MedicationSchedule[];
}

// Slot: Buổi uống thuốc
const slotLabelMap: Record<string, string> = {
  Morning: "Buổi sáng",
  Afternoon: "Buổi trưa",
  Evening: "Buổi tối",
};

const slotIconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Morning: "wb-sunny",
  Afternoon: "wb-cloudy",
  Evening: "nightlight-round",
};

// Status: Trạng thái uống thuốc
const scheduleStatusMap: Record<
  string,
  { label: string; color: string; hex: string }
> = {
  Pending: { label: "Chờ uống", color: "text-yellow-500", hex: "#eab308" },
  Done: { label: "Đã uống", color: "text-green-600", hex: "#16a34a" },
  "Not taken": { label: "Không uống", color: "text-gray-500", hex: "#6b7280" },
  Cancelled: { label: "Đã huỷ", color: "text-red-500", hex: "#ef4444" },
};

export const MedicationCalendar = ({ schedules }: Props) => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Group dots per date
  const markedDates = schedules.reduce((acc, item) => {
    const date = item.date.split("T")[0];
    const status = item.status;
    const dotColor = scheduleStatusMap[status]?.hex || "gray";

    if (!acc[date]) {
      acc[date] = {
        dots: [],
      };
    }

    // Luôn thêm dot cho mỗi buổi, kể cả trùng màu
    acc[date].dots.push({ color: dotColor });

    return acc;
  }, {} as Record<string, any>);

  const filteredSchedules = schedules.filter(
    (item) => item.date.split("T")[0] === selectedDate
  );

  return (
    <View className="bg-white rounded-xl p-5 mb-10 shadow">
      <Text className="text-xl font-bold text-gray-800 mb-3">
        Lịch uống thuốc
      </Text>

      <Calendar
        markingType="multi-dot"
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: "#2563EB",
            },
          }),
        }}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
      />

      {selectedDate && (
        <View className="mt-4">
          <View className="flex-row items-center mb-2">
            <MaterialIcons
              name="calendar-today"
              size={20}
              color="#1F2937"
              style={{ marginRight: 6 }}
            />
            <Text className="text-lg font-bold text-gray-800">
              Chi tiết {(() => {
                const [y, m, d] = selectedDate.split("-").map(Number);
                return new Date(y, m - 1, d).toLocaleDateString("vi-VN");
              })()}
            </Text>
          </View>

          {filteredSchedules.length === 0 ? (
            <Text className="text-gray-500 italic">
              Không có lịch uống thuốc.
            </Text>
          ) : (
            <FlatList
              data={filteredSchedules}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View className="border border-gray-200 rounded-lg p-3 mb-2">
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons
                      name={slotIconMap[item.sessionSlots]}
                      size={18}
                      color="#4B5563"
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-base font-medium text-gray-700">
                      {slotLabelMap[item.sessionSlots] || item.sessionSlots}
                    </Text>
                  </View>
                  <Text
                    className={`text-sm font-semibold ${
                      scheduleStatusMap[item.status]?.color || "text-gray-600"
                    }`}
                  >
                    {scheduleStatusMap[item.status]?.label || item.status}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};
