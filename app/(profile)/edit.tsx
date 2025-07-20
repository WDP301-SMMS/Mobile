import { useAuth } from "@/libs/context/AuthContext";
import { useAppDispatch } from "@/libs/stores";
import { updateUser } from "@/libs/stores/userManager/thunk";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
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

export default function EditProfileScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("MALE");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const convertUTCToLocalDate = (utcDateStr: string) => {
    const utcDate = new Date(utcDateStr);
    return new Date(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate()
    );
  };

  const formatDateForDisplay = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setGender(user.gender || "MALE");
      setDob(user.dob ? convertUTCToLocalDate(user.dob) : new Date());
    }
  }, [user]);

  const handleSubmit = async () => {
    setSubmitting(true);

    const dobFormatted = `${String(dob.getDate()).padStart(2, "0")}/${String(
      dob.getMonth() + 1
    ).padStart(2, "0")}/${dob.getFullYear()}`;

    const payload = {
      username,
      dob: dobFormatted,
      phone,
      gender,
    };
    console.log("Submitting profile update:", payload);

    try {
      await dispatch(updateUser(payload)).unwrap();
      Alert.alert("Thành công", "Cập nhật hồ sơ thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật thất bại. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-3xl font-bold text-primary mb-8 text-center">
        Chỉnh sửa hồ sơ
      </Text>

      <FormRow icon="person" label="Họ và tên">
        <TextInput
          value={username}
          onChangeText={setUsername}
          className="text-base text-gray-900"
          placeholder="Nhập họ và tên"
          placeholderTextColor="#9CA3AF"
        />
      </FormRow>

      <FormRow icon="phone" label="Số điện thoại">
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          className="text-base text-gray-900"
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#9CA3AF"
        />
      </FormRow>

      <FormRow icon="wc" label="Giới tính">
        <View className="flex-row gap-x-4 mt-1">
          {["MALE", "FEMALE"].map((option) => (
            <TouchableOpacity
              key={option}
              className={`flex-1 py-2 rounded-lg items-center border ${
                gender === option
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setGender(option)}
            >
              <Text
                className={`text-base font-medium ${
                  gender === option ? "text-white" : "text-gray-700"
                }`}
              >
                {option === "MALE" ? "Nam" : "Nữ"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </FormRow>

      <FormRow icon="cake" label="Ngày sinh">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="py-2"
        >
          <Text className="text-base text-gray-900">
            {formatDateForDisplay(dob)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDob(selectedDate);
            }}
            maximumDate={new Date()}
          />
        )}
      </FormRow>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        className={`mt-10 py-4 rounded-xl items-center shadow-md ${
          submitting ? "bg-blue-300" : "bg-blue-600"
        }`}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">
            Lưu thay đổi
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function FormRow({
  icon,
  label,
  children,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-2">
        <MaterialIcons name={icon} size={20} color="#4B5563" />
        <Text className="ml-2 text-base font-medium text-gray-700">
          {label}
        </Text>
      </View>
      <View className="bg-gray-100 rounded-xl px-4 py-3">{children}</View>
    </View>
  );
}
