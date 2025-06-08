import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

interface ConsentForm {
  title: string;
  status: string;
  date: string;
}

interface MedicalResult {
  title: string;
  status: string;
  date: string;
}

interface Appointment {
  title: string;
  date: string;
  time: string;
  status: string;
}

interface MedicationRecord {
  medication: string;
  dosage: string;
  frequency: string;
  date: string;
}

interface ChildDetailData {
  id: string;
  fullName: string;
  avatar: string;
  className: string;
  schoolYear: string;
  dob: string;
  gender: string;
  initialHealthDeclaration?: string;
  consentForms?: ConsentForm[];
  medicalResults?: MedicalResult[];
  appointments?: Appointment[];
  medicationRecords?: MedicationRecord[];
  notes?: string;
}

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams();
  const [childData, setChildData] = useState<ChildDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const allChildrenData: ChildDetailData[] = [
    {
      id: "1",
      fullName: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?img=6",
      className: "Lớp 3A",
      schoolYear: "2023-2024",
      dob: "15/09/2017",
      gender: "Nam",
      initialHealthDeclaration:
        "Tiền sử hen suyễn nhẹ, không có bệnh truyền nhiễm. Đã tiêm đủ vắc xin cơ bản theo lịch.",
      consentForms: [
        {
          title: "Phiếu đồng ý tiêm sởi",
          status: "Đã phản hồi",
          date: "08/06/2025",
        },
        {
          title: "Phiếu đồng ý khám tổng quát",
          status: "Chưa phản hồi",
          date: "07/06/2025",
        },
      ],
      medicalResults: [
        {
          title: "Kết quả khám sức khỏe 2024",
          status: "Đã có",
          date: "10/05/2024",
        },
      ],
      appointments: [
        {
          title: "Khám định kỳ",
          date: "20/07/2025",
          time: "09:00",
          status: "Sắp tới",
        },
        {
          title: "Tiêm nhắc uốn ván",
          date: "15/06/2025",
          time: "14:00",
          status: "Sắp tới",
        },
      ],
      medicationRecords: [
        {
          medication: "Thuốc ho",
          dosage: "5ml",
          frequency: "2 lần/ngày",
          date: "01/06/2025",
        },
        {
          medication: "Thuốc hạ sốt",
          dosage: "1 viên",
          frequency: "Khi sốt",
          date: "28/05/2025",
        },
      ],
      notes:
        "Nhanh nhẹn, hòa đồng. Có khả năng thích nghi tốt với môi trường mới. Cần lưu ý về chế độ ăn uống do có tiền sử dị ứng nhẹ với hải sản.",
    },
    {
      id: "2",
      fullName: "Trần Thị B",
      avatar: "https://i.pravatar.cc/150?img=10",
      className: "Lớp 5C",
      schoolYear: "2022-2023",
      dob: "20/03/2015",
      gender: "Nữ",
      initialHealthDeclaration:
        "Không có tiền sử bệnh nền. Sức khỏe tốt. Đã hoàn thành tiêm chủng cơ bản.",
      consentForms: [],
      medicalResults: [],
      appointments: [],
      medicationRecords: [],
      notes:
        "Thích đọc sách và tham gia các hoạt động nghệ thuật. Có thể hơi nhạy cảm với tiếng ồn lớn.",
    },
    {
      id: "3",
      fullName: "Lê Minh C",
      avatar: "https://i.pravatar.cc/150?img=11",
      className: "Lớp 1B",
      schoolYear: "2024-2025",
      dob: "01/11/2019",
      gender: "Nam",
      initialHealthDeclaration:
        "Chưa ghi nhận bệnh sử đặc biệt. Phát triển bình thường theo lứa tuổi.",
      consentForms: [],
      medicalResults: [],
      appointments: [],
      medicationRecords: [],
      notes:
        "Khá nhút nhát ban đầu nhưng rất hòa đồng khi đã quen. Thích chơi các trò chơi vận động.",
    },
    {
      id: "4",
      fullName: "Phạm Thị D",
      avatar: "https://i.pravatar.cc/150?img=12",
      className: "Lớp 3A",
      schoolYear: "2023-2024",
      dob: "05/07/2017",
      gender: "Nữ",
      initialHealthDeclaration:
        "Tiền sử ho khan kéo dài vào mùa đông. Cần bổ sung vitamin C thường xuyên.",
      consentForms: [],
      medicalResults: [],
      appointments: [],
      medicationRecords: [],
      notes:
        "Cần chú ý dinh dưỡng và đảm bảo đủ giấc ngủ. Rất chăm chỉ và tập trung trong học tập.",
    },
  ];

  useEffect(() => {
    if (id) {
      const foundChild = allChildrenData.find(
        (child) => child.id === (id as string)
      );
      setChildData(foundChild || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0288D1" />
        <Text className="mt-2 text-gray-600">Đang tải hồ sơ...</Text>
      </View>
    );
  }

  if (!childData) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <MaterialIcons name="error-outline" size={50} color="#EF4444" />
        <Text className="mt-4 text-xl font-semibold text-danger text-center">
          Không tìm thấy hồ sơ.
        </Text>
        <Text className="mt-2 text-gray-600 text-center">
          Vui lòng thử lại hoặc quay lại trang trước.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white pt-8">
      <Stack.Screen
        options={{
          title: childData.fullName,
          headerBackTitle: "Quay lại",
        }}
      />

      <View className="px-6 pb-6 items-center border-b border-gray-100">
        <Image
          source={{ uri: childData.avatar }}
          className="w-32 h-32 rounded-full border-4 border-secondary mb-4"
          resizeMode="cover"
        />
        <Text className="text-3xl font-extrabold text-primary mb-1">
          {childData.fullName}
        </Text>
        <Text className="text-xl text-gray-700">{childData.className}</Text>
        <Text className="text-base text-gray-500 mt-1">
          Niên khóa: {childData.schoolYear}
        </Text>
      </View>

      <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="info" size={24} color="#6B7280" />
          <Text className="text-xl font-bold text-primary ml-3">
            Thông tin cơ bản
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-gray-700 text-base font-semibold">
            Ngày sinh:
          </Text>
          <Text className="text-gray-600 text-base">{childData.dob}</Text>
        </View>

        <View>
          <Text className="text-gray-700 text-base font-semibold">
            Giới tính:
          </Text>
          <Text className="text-gray-600 text-base">{childData.gender}</Text>
        </View>
      </View>

      <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="visibility" size={24} color="#6B7280" />
          <Text className="text-xl font-bold text-primary ml-3">
            Khai báo sức khỏe ban đầu
          </Text>
        </View>
        <Text className="text-gray-600 text-base leading-relaxed">
          {childData.initialHealthDeclaration ||
            "Chưa có thông tin khai báo sức khỏe ban đầu."}
        </Text>
      </View>

      <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="fact-check" size={24} color="#6B7280" />
          <Text className="text-xl font-bold text-primary ml-3">
            Đơn từ & Kết quả
          </Text>
        </View>

        {childData.consentForms && childData.consentForms.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Phiếu Đồng Ý:
            </Text>
            {childData.consentForms.map((consent, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center bg-blue-50 p-3 rounded-lg mb-2"
              >
                <View className="flex-1">
                  <Text className="text-base font-medium text-blue-800">
                    {consent.title}
                  </Text>
                  <Text className="text-sm text-blue-600">
                    Trạng thái: {consent.status}
                  </Text>
                </View>
                <Text className="text-sm text-blue-500">{consent.date}</Text>
              </View>
            ))}
          </View>
        )}

        {childData.medicalResults && childData.medicalResults.length > 0 && (
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Kết Quả Tiêm & Khám:
            </Text>
            {childData.medicalResults.map((result, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center bg-green-50 p-3 rounded-lg mb-2"
              >
                <View className="flex-1">
                  <Text className="text-base font-medium text-green-800">
                    {result.title}
                  </Text>
                  <Text className="text-sm text-green-600">
                    Trạng thái: {result.status}
                  </Text>
                </View>
                <Text className="text-sm text-green-500">{result.date}</Text>
              </View>
            ))}
          </View>
        )}

        {(!childData.consentForms || childData.consentForms.length === 0) &&
          (!childData.medicalResults ||
            childData.medicalResults.length === 0) && (
            <Text className="text-gray-600 text-base">
              Chưa có thông tin đơn từ hoặc kết quả.
            </Text>
          )}
      </View>

      <View className="px-6 py-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="event" size={24} color="#6B7280" />
          <Text className="text-xl font-bold text-primary ml-3">Lịch hẹn</Text>
        </View>
        {childData.appointments && childData.appointments.length > 0 ? (
          childData.appointments.map((appointment, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center bg-yellow-50 p-3 rounded-lg mb-2"
            >
              <View className="flex-1">
                <Text className="text-base font-medium text-yellow-800">
                  {appointment.title}
                </Text>
                <Text className="text-sm text-yellow-600">
                  Ngày: {appointment.date} - Giờ: {appointment.time}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-yellow-700">
                {appointment.status}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-600 text-base">Chưa có lịch hẹn nào.</Text>
        )}
      </View>

      <View className="px-6 py-6 pb-20">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="medical-information" size={24} color="#6B7280" />
          <Text className="text-xl font-bold text-primary ml-3">
            Ghi nhận thuốc
          </Text>
        </View>
        {childData.medicationRecords &&
        childData.medicationRecords.length > 0 ? (
          childData.medicationRecords.map((record, index) => (
            <View key={index} className="bg-purple-50 p-3 rounded-lg mb-2">
              <Text className="text-base font-medium text-purple-800">
                <Text className="font-semibold">Thuốc:</Text>{" "}
                {record.medication}
              </Text>
              <Text className="text-sm text-purple-600">
                <Text className="font-semibold">Liều lượng:</Text>{" "}
                {record.dosage} -{" "}
                <Text className="font-semibold">Tần suất:</Text>{" "}
                {record.frequency}
              </Text>
              <Text className="text-xs text-purple-500 mt-1">
                Ngày ghi nhận: {record.date}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-600 text-base">
            Chưa có ghi nhận thuốc nào.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
