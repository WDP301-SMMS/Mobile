import { useConsent } from "@/libs/hooks/useConsent";
import { useAppDispatch } from "@/libs/stores";
import {
  getConsentById,
  updateConsentStatus,
} from "@/libs/stores/consentManager/thunk";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ chấp thuận", color: "text-orange-500" },
  APPROVED: { label: "Đồng ý", color: "text-green-600" },
  DECLINED: { label: "Từ chối", color: "text-red-600" },
  COMPLETED: { label: "Đã hoàn tất", color: "text-blue-600" },
  OVERDUE: { label: "Quá hạn", color: "text-red-500" },
  NO_RESPONSE: { label: "Không phản hồi", color: "text-gray-400" },
  REVOKED: { label: "Đã thu hồi", color: "text-gray-500" },
  UNDER_OPSERVATION: { label: "Đang theo dõi", color: "text-yellow-600" },
  ADVERSE_REACTION: { label: "Phản ứng phụ", color: "text-pink-600" },
};

export default function ConsentDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { consentDetail, loading } = useConsent();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (id) dispatch(getConsentById(id as string));
  }, [dispatch, id]);

  const consent = consentDetail?.consents.find((c) => c._id === id);

  const handleAction = async (status: "APPROVED" | "DECLINED") => {
    if (!consent?.campaignId?._id || !consent?.studentId) {
      Alert.alert("Lỗi", "Thiếu thông tin chiến dịch hoặc học sinh.");
      return;
    }

    if (status === "DECLINED" && !reason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do từ chối để tiếp tục.");
      return;
    }

    const confirmText = status === "APPROVED" ? "Đồng ý" : "Từ chối";

    Alert.alert(
      `Xác nhận ${confirmText}`,
      `Bạn có chắc chắn muốn ${confirmText.toLowerCase()} với phiếu này?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: confirmText,
          onPress: async () => {
            try {
              await dispatch(
                updateConsentStatus({
                  campaignId: consent.campaignId._id,
                  studentId: consent.studentId,
                  status,
                  ...(status === "DECLINED" && { reasonForDeclining: reason }),
                })
              ).unwrap();
              setReason("");
              router.back();
            } catch {
              Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
            }
          },
        },
      ]
    );
  };

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
      <Text className="text-gray-600 font-medium">{label}:</Text>
      <Text className="text-gray-800 flex-1 text-right ml-4">{value}</Text>
    </View>
  );

  const renderConsentStatus = () => {
    if (!consent) {
      return (
        <Text className="font-semibold text-gray-500">Không có dữ liệu</Text>
      );
    }

    const status = statusMap[consent.status] || {
      label: consent.status,
      color: "text-gray-500",
    };

    return (
      <Text className={`font-semibold ${status.color}`}>{status.label}</Text>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5">
        {loading ? (
          <View className="flex-1 justify-center items-center h-64">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-lg text-gray-600">
              Đang tải thông tin...
            </Text>
          </View>
        ) : !consent ? (
          <View className="flex-1 justify-center items-center h-64">
            <Text className="text-lg text-gray-600">
              Không tìm thấy thông tin đồng ý.
            </Text>
          </View>
        ) : (
          <>
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
              <Text className="text-xl font-bold text-blue-700 mb-3">
                Thông tin học sinh
              </Text>
              <DetailItem
                label="Tên học sinh"
                value={consentDetail?.studentName || "N/A"}
              />
              <DetailItem label="ID phiếu" value={consent._id} />
            </View>

            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Thông tin chiến dịch
              </Text>
              <DetailItem label="Chiến dịch" value={consent.campaignId.name} />
              <DetailItem
                label="Tên Vaccine"
                value={consent.campaignId.vaccineName}
              />
              <DetailItem
                label="Liều số"
                value={consent.campaignId.doseNumber}
              />
              <DetailItem
                label="Mô tả"
                value={consent.campaignId.description}
              />
              <DetailItem
                label="Ngày bắt đầu"
                value={new Date(
                  consent.campaignId.startDate
                ).toLocaleDateString()}
              />
              <DetailItem
                label="Ngày kết thúc"
                value={new Date(
                  consent.campaignId.endDate
                ).toLocaleDateString()}
              />
            </View>

            <View className="bg-white rounded-xl p-5 mb-8 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Trạng thái phiếu
              </Text>
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-600 font-medium">
                  Trạng thái hiện tại:
                </Text>
                {renderConsentStatus()}
              </View>
              {consent.reasonForDeclining && (
                <DetailItem
                  label="Lý do từ chối"
                  value={consent.reasonForDeclining}
                />
              )}
              <DetailItem
                label="Ngày tạo phiếu"
                value={new Date(consent.createdAt).toLocaleDateString()}
              />
              <DetailItem
                label="Cập nhật gần nhất"
                value={new Date(consent.updatedAt).toLocaleDateString()}
              />
            </View>

            {consent.status === "PENDING" && (
              <View className="bg-white rounded-xl p-5 shadow">
                <Text className="text-xl font-bold text-gray-800 mb-4">
                  Hành động
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-base mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập lý do từ chối (bắt buộc nếu từ chối)"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                  editable={!loading}
                  style={{ height: 80, textAlignVertical: "top" }}
                />
                <View className="flex-row justify-around gap-x-4 mb-4">
                  <TouchableOpacity
                    onPress={() => handleAction("APPROVED")}
                    className={`flex-1 items-center justify-center py-3 px-6 rounded-lg ${
                      loading ? "bg-primary/50" : "bg-primary"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text className="text-white font-semibold text-lg">
                        Đồng ý
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAction("DECLINED")}
                    className={`flex-1 items-center justify-center py-3 px-6 rounded-lg ${
                      loading ? "bg-red-300" : "bg-red-600"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text className="text-white font-semibold text-lg">
                        Từ chối
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
