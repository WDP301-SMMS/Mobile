import { useAppointment } from "@/libs/hooks/useAppointment";
import { useAppDispatch } from "@/libs/stores";
import {
  getAppointmentDetail,
  respondToAppointment,
} from "@/libs/stores/appointmentManager/thunk";
import { router, useLocalSearchParams } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
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
  SCHEDULED: { label: "Đã lên lịch", color: "text-yellow-600" },
  COMPLETED: { label: "Đã hoàn tất", color: "text-green-600" },
  CANCELLED: { label: "Đã huỷ", color: "text-red-600" },
  APPROVED: { label: "Đã xác nhận", color: "text-blue-600" },
};

const renderGender = (gender: string) => {
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    default:
      return "Khác";
  }
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { appointmentDetail, loading } = useAppointment();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (id) dispatch(getAppointmentDetail(id as string));
  }, [dispatch, id]);

  const appointment = appointmentDetail;

  const handleAction = (action: "APPROVED" | "CANCELLED") => {
    if (!appointment?._id) return;

    if (action === "CANCELLED" && !reason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do huỷ để tiếp tục.");
      return;
    }

    const confirmText = action === "APPROVED" ? "Chấp thuận" : "Từ chối";

    Alert.alert(
      `Xác nhận ${confirmText}`,
      `Bạn có chắc chắn muốn ${confirmText.toLowerCase()} cuộc hẹn này?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: confirmText,
          onPress: async () => {
            try {
              await dispatch(
                respondToAppointment({
                  appointmentId: appointment._id,
                  action,
                  ...(action === "CANCELLED" && { reason }),
                })
              ).unwrap();
              Alert.alert(
                "Thành công",
                `Đã ${confirmText.toLowerCase()} cuộc hẹn.`
              );
              router.back();
            } catch (err) {
              Alert.alert("Lỗi", String(err));
            }
          },
        },
      ]
    );
  };

  const DetailItem = ({
    label,
    value,
    children,
  }: {
    label: string;
    value?: string;
    children?: ReactNode;
  }) => (
    <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
      <Text className="text-gray-600 font-medium">{label}:</Text>
      {value ? (
        <Text className="text-gray-800 flex-1 text-right ml-4">{value}</Text>
      ) : (
        <View className="flex-1 items-end ml-4">{children}</View>
      )}
    </View>
  );

  const renderStatus = () => {
    if (!appointment) return <Text className="text-gray-500">Không rõ</Text>;
    const status = statusMap[appointment.status] || {
      label: appointment.status,
      color: "text-gray-500",
    };
    return (
      <Text className={`font-semibold ${status.color}`}>{status.label}</Text>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5">
        {loading || !appointment ? (
          <View className="flex-1 justify-center items-center h-64">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-lg text-gray-600">
              Đang tải thông tin...
            </Text>
          </View>
        ) : (
          <>
            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Thông tin học sinh
              </Text>
              <DetailItem
                label="Họ tên"
                value={appointment.studentId.fullName}
              />
              <DetailItem
                label="Ngày sinh"
                value={formatDate(appointment.studentId.dateOfBirth)}
              />
              <DetailItem
                label="Giới tính"
                value={renderGender(appointment.studentId.gender)}
              />
            </View>

            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Thông tin phụ huynh
              </Text>
              <DetailItem
                label="Họ tên"
                value={appointment.parentId.username}
              />
              <DetailItem label="Email" value={appointment.parentId.email} />
              <DetailItem label="SĐT" value={appointment.parentId.phone} />
            </View>

            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Kết quả kiểm tra
              </Text>
              <DetailItem
                label="Ngày kiểm tra"
                value={formatDate(appointment.resultId.checkupDate)}
              />
              <DetailItem
                label="Kết luận"
                value={appointment.resultId.overallConclusion}
              />
              <DetailItem
                label="Có bất thường"
                value={appointment.resultId.isAbnormal ? "Có" : "Không"}
              />
            </View>

            <View className="bg-white rounded-xl p-5 mb-6 shadow">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Thông tin cuộc hẹn
              </Text>
              <DetailItem
                label="Thời gian"
                value={formatDateTime(appointment.meetingTime)}
              />
              <DetailItem label="Địa điểm" value={appointment.location} />
              <DetailItem label="Trạng thái">{renderStatus()}</DetailItem>
              <DetailItem
                label="Ghi chú"
                value={appointment.notes || "Không có"}
              />
              <DetailItem
                label="Ghi chú sau gặp"
                value={appointment.afterMeetingNotes || "Chưa cập nhật"}
              />
            </View>

            {appointment.status === "SCHEDULED" && (
              <View className="bg-white rounded-xl p-5 shadow mb-10">
                <Text className="text-xl font-bold text-gray-800 mb-4">
                  Hành động
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-base mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập lý do từ chối (nếu huỷ)"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                  editable={!loading}
                  style={{ height: 80, textAlignVertical: "top" }}
                />
                <View className="flex-row justify-around gap-x-4">
                  <TouchableOpacity
                    onPress={() => handleAction("APPROVED")}
                    className={`flex-1 items-center justify-center py-3 px-6 rounded-lg ${
                      loading ? "bg-primary/50" : "bg-primary"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-semibold text-lg">
                        Chấp thuận
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleAction("CANCELLED")}
                    className={`flex-1 items-center justify-center py-3 px-6 rounded-lg ${
                      loading ? "bg-red-300" : "bg-red-600"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
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
