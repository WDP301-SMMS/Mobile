import { useHealthCheck } from "@/libs/hooks/useHealthCheck";
import { useAppDispatch } from "@/libs/stores";
import {
  getHealthCheckConsentDetail,
  updateConsent,
} from "@/libs/stores/healthCheckManager/thunk";
import dayjs from "dayjs";
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

export default function ConsentDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { consentDetail, loading } = useHealthCheck();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getHealthCheckConsentDetail(id as string));
    }
  }, [dispatch, id]);

  const consent = consentDetail;

  const handleApprove = async () => {
    if (!consent?.campaignId?._id || !consent?.studentId?._id) {
      Alert.alert("Lỗi", "Thiếu thông tin chiến dịch hoặc học sinh.");
      return;
    }

    Alert.alert("Xác nhận Đồng ý", "Bạn có chắc chắn muốn đồng ý?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            await dispatch(
              updateConsent({
                id: id as string,
                body: {
                  status: "APPROVED",
                },
              })
            ).unwrap();
            router.back();
          } catch {
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
          }
        },
      },
    ]);
  };

  const handleDecline = () => {
    if (!consent?.campaignId?._id || !consent?.studentId?._id) {
      Alert.alert("Lỗi", "Thiếu thông tin chiến dịch hoặc học sinh.");
      return;
    }

    if (!reason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do từ chối.");
      return;
    }

    Alert.alert("Xác nhận Từ chối", "Bạn có chắc chắn muốn từ chối?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Từ chối",
        onPress: async () => {
          try {
            await dispatch(
              updateConsent({
                id: id as string,
                body: {
                  status: "DECLINED",
                  reasonForDeclining: reason,
                },
              })
            ).unwrap();
            setReason("");
            router.back();
          } catch {
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
          }
        },
      },
    ]);
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
            {/* Thông tin học sinh */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
              <Text className="text-xl font-bold text-blue-700 mb-3">
                Thông tin học sinh
              </Text>
              <DetailItem label="Họ tên" value={consent.studentId.fullName} />
              <DetailItem
                label="Ngày sinh"
                value={dayjs(consent.studentId.dateOfBirth).format(
                  "DD/MM/YYYY"
                )}
              />
              <DetailItem
                label="Giới tính"
                value={consent.studentId.gender === "MALE" ? "Nam" : "Nữ"}
              />
              <DetailItem
                label="Lớp"
                value={`${consent.classId.className} (${consent.classId.schoolYear})`}
              />
            </View>

            {/* Thông tin chiến dịch */}
            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Thông tin chiến dịch
              </Text>
              <DetailItem
                label="Tên chiến dịch"
                value={consent.campaignId.name}
              />
              <DetailItem
                label="Năm học"
                value={consent.campaignId.schoolYear}
              />
              <DetailItem
                label="Thời gian"
                value={`${dayjs(consent.campaignId.startDate).format(
                  "DD/MM/YYYY"
                )} - ${dayjs(consent.campaignId.endDate).format("DD/MM/YYYY")}`}
              />
            </View>

            {/* Trạng thái phiếu */}
            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Trạng thái phiếu
              </Text>
              <DetailItem
                label="Trạng thái"
                value={
                  {
                    PENDING: "Chờ chấp thuận",
                    APPROVED: "Đồng ý",
                    DECLINED: "Từ chối",
                    COMPLETED: "Đã hoàn tất",
                    OVERDUE: "Quá hạn",
                    NO_RESPONSE: "Không phản hồi",
                    REVOKED: "Đã thu hồi",
                    UNDER_OPSERVATION: "Đang theo dõi",
                    ADVERSE_REACTION: "Phản ứng phụ",
                  }[consent.status] || "Không xác định"
                }
              />
              {consent.reasonForDeclining && (
                <DetailItem
                  label="Lý do từ chối"
                  value={consent.reasonForDeclining}
                />
              )}
              {consent.confirmedAt && (
                <DetailItem
                  label="Xác nhận lúc"
                  value={dayjs(consent.confirmedAt).format("DD/MM/YYYY")}
                />
              )}
            </View>

            {/* Y tá phụ trách */}
            <View className="bg-white rounded-xl p-5 mb-8 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Y tá phụ trách
              </Text>
              <DetailItem label="Tên" value={consent.nurseId.username} />
              <DetailItem label="Email" value={consent.nurseId.email} />
              <DetailItem label="SĐT" value={consent.nurseId.phone} />
            </View>

            {/* Hành động */}
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
                    onPress={handleApprove}
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
                    onPress={handleDecline}
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
