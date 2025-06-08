import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // Import Picker cho dropdown
import { Stack } from "expo-router"; // Để tùy chỉnh header
import { useEffect, useState } from "react";
import { Image, Platform, ScrollView, Text, View } from "react-native";

// --- Định nghĩa các Kiểu (Interfaces) ---

interface ConsentForm {
  id: string;
  title: string;
  status: 'pending' | 'agreed' | 'rejected'; // 'Chờ phản hồi', 'Đã đồng ý', 'Từ chối'
  date: string;
}

interface MedicalResult {
  id: string;
  title: string;
  result: string;
  date: string;
}

interface MedicationRecord {
  id: string;
  date: string;
  medication: string;
  dosage?: string; // Liều lượng
  confirmedBy: string; // Ai xác nhận (Y tá/Giáo viên)
}

interface ChildHealthRecord {
  id: string;
  fullName: string;
  avatar: string;
  consentForms: ConsentForm[];
  medicalResults: MedicalResult[];
  medicationRecords: MedicationRecord[];
}

// --- Dữ liệu mẫu (Thực tế sẽ từ API) ---
const allChildrenHealthData: ChildHealthRecord[] = [
  {
    id: "child1",
    fullName: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=6",
    consentForms: [
      { id: "c1", title: "Phiếu đồng ý tiêm cúm mùa", status: "pending", date: "05/06/2025" },
      { id: "c2", title: "Phiếu đồng ý tiêm sởi", status: "agreed", date: "08/06/2025" },
      { id: "c3", title: "Phiếu đồng ý tham gia dã ngoại", status: "rejected", date: "01/06/2025" },
    ],
    medicalResults: [
      { id: "m1", title: "Khám định kỳ 05/2025", result: "Tình trạng sức khỏe bình thường, phát triển tốt.", date: "10/05/2025" },
      { id: "m2", title: "Kết quả test cúm A", result: "Âm tính.", date: "06/06/2025" },
    ],
    medicationRecords: [
      { id: "med1", date: "06/06/2025", medication: "Thuốc ho (5ml)", confirmedBy: "Y tá Thu Phương" },
      { id: "med2", date: "05/06/2025", medication: "Thuốc hạ sốt (1 viên)", confirmedBy: "Y tá Minh Anh" },
    ],
  },
  {
    id: "child2",
    fullName: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=10",
    consentForms: [
      { id: "c4", title: "Phiếu đồng ý khám mắt", status: "pending", date: "01/07/2025" },
    ],
    medicalResults: [
      { id: "m3", title: "Kiểm tra thị lực", result: "Mắt trái 10/10, mắt phải 9/10.", date: "15/05/2025" },
    ],
    medicationRecords: [
      { id: "med3", date: "01/06/2025", medication: "Vitamin C (1 viên)", dosage: "1 viên/ngày", confirmedBy: "Giáo viên chủ nhiệm" },
    ],
  },
  {
    id: "child3",
    fullName: "Lê Minh C",
    avatar: "https://i.pravatar.cc/150?img=11",
    consentForms: [],
    medicalResults: [],
    medicationRecords: [],
  },
];

export default function FormScreen() {
  const [selectedChildId, setSelectedChildId] = useState<string>(allChildrenHealthData[0]?.id || "");
  const [currentChildData, setCurrentChildData] = useState<ChildHealthRecord | null>(null);

  useEffect(() => {
    if (selectedChildId) {
      const foundChild = allChildrenHealthData.find(child => child.id === selectedChildId);
      setCurrentChildData(foundChild || null);
    } else {
      setCurrentChildData(null);
    }
  }, [selectedChildId]);

  // Hàm để lấy icon và màu sắc trạng thái phiếu đồng ý
  const getConsentStatusIcon = (status: ConsentForm['status']) => {
    switch (status) {
      case 'agreed': return { name: "check-circle", color: "#28a745" }; // Green
      case 'rejected': return { name: "cancel", color: "#dc3545" }; // Red
      case 'pending': return { name: "hourglass-empty", color: "#ffc107" }; // Yellow
      default: return { name: "help-outline", color: "#6c757d" }; // Gray
    }
  };

  return (
    <ScrollView className="flex-1 bg-white pt-4">
      <Stack.Screen options={{
        title: "Đơn & Kết Quả",
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#0288d1",
        },
      }} />

      {/* Dropdown chọn học sinh */}
      <View className="px-6 py-4 border-b border-gray-100 flex-row items-center bg-blue-50">
        <MaterialIcons name="person" size={24} color="#0288D1" />
        <Text className="text-primary font-semibold text-base ml-2">Chọn học sinh:</Text>
        <View className="flex-1 ml-3 border border-blue-200 rounded-lg overflow-hidden">
          <Picker
            selectedValue={selectedChildId}
            onValueChange={(itemValue: string) => setSelectedChildId(itemValue)}
            style={{ height: Platform.OS === 'ios' ? 120 : 50, width: '100%' }} // height for iOS
            itemStyle={Platform.OS === 'ios' ? { height: 120 } : {}} // itemStyle for iOS
          >
            {allChildrenHealthData.map((child) => (
              <Picker.Item key={child.id} label={child.fullName} value={child.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Hiển thị thông tin học sinh được chọn */}
      {currentChildData ? (
        <View className="px-6 py-6">
          {/* Thông tin chung của bé */}
          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: currentChildData.avatar }}
              className="w-16 h-16 rounded-full border-2 border-primary"
              resizeMode="cover"
            />
            <Text className="text-2xl font-bold text-primary ml-4">
              {currentChildData.fullName}
            </Text>
          </View>

          {/* Phần Phiếu đồng ý */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="description" size={24} color="#6B7280" />
              <Text className="text-xl font-bold text-primary ml-3">Phiếu Đồng Ý</Text>
            </View>
            {currentChildData.consentForms.length > 0 ? (
              currentChildData.consentForms.map((consent) => {
                const statusIcon = getConsentStatusIcon(consent.status);
                return (
                  <View key={consent.id} className="flex-row items-center bg-gray-50 p-3 rounded-lg mb-2 border border-gray-200">
                    <MaterialIcons name={statusIcon.name as any} size={20} color={statusIcon.color} />
                    <Text className="text-base text-gray-800 ml-3 flex-1">
                      {consent.title}
                    </Text>
                    <Text className={`text-sm font-semibold ${statusIcon.color === '#28a745' ? 'text-green-600' : statusIcon.color === '#dc3545' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {consent.status === 'pending' ? 'Chờ phản hồi' : consent.status === 'agreed' ? 'Đã đồng ý' : 'Từ chối'}
                    </Text>
                    <Text className="text-sm text-gray-500 ml-2">{consent.date}</Text>
                  </View>
                );
              })
            ) : (
              <Text className="text-gray-600 text-base italic">Chưa có phiếu đồng ý nào.</Text>
            )}
          </View>

          {/* Phần Kết quả khám */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="medical-information" size={24} color="#6B7280" />
              <Text className="text-xl font-bold text-primary ml-3">Kết Quả Khám</Text>
            </View>
            {currentChildData.medicalResults.length > 0 ? (
              currentChildData.medicalResults.map((result) => (
                <View key={result.id} className="bg-gray-50 p-3 rounded-lg mb-2 border border-gray-200">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    {result.title}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    <Text className="font-medium">Kết quả:</Text> {result.result}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1 text-right">Ngày: {result.date}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-600 text-base italic">Chưa có kết quả khám nào.</Text>
            )}
          </View>

          {/* Phần Thuốc đã uống */}
          <View className="pb-20">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="medication" size={24} color="#6B7280" />
              <Text className="text-xl font-bold text-primary ml-3">Thuốc Đã Uống</Text>
            </View>
            {currentChildData.medicationRecords.length > 0 ? (
              currentChildData.medicationRecords.map((med) => (
                <View key={med.id} className="bg-gray-50 p-3 rounded-lg mb-2 border border-gray-200">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    <MaterialIcons name="healing" size={16} color="#4CAF50" /> {med.medication} {med.dosage ? `(${med.dosage})` : ''}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    <MaterialIcons name="person" size={14} color="#6B7280" /> Xác nhận bởi: {med.confirmedBy}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1 text-right">Ngày: {med.date}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-600 text-base italic">Chưa có ghi nhận thuốc nào.</Text>
            )}
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center py-10 px-6 pb-10">
          <MaterialIcons name="info-outline" size={50} color="#B0BEC5" />
          <Text className="mt-4 text-xl font-semibold text-gray-700 text-center">
            Vui lòng chọn một học sinh để xem hồ sơ.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}