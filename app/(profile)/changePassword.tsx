import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useUser } from "@/libs/hooks/useUser";
import { useAppDispatch } from "@/libs/stores";
import { changePassword } from "@/libs/stores/userManager/thunk";
import { unwrapResult } from "@reduxjs/toolkit";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự.");
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };

    try {
      const resultAction = await dispatch(changePassword(payload));
      unwrapResult(resultAction);

      Alert.alert("Thành công", "Mật khẩu đã được thay đổi.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err?.message || "Đổi mật khẩu thất bại.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        backgroundColor: "white",
        flexGrow: 1,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Đổi mật khẩu
      </Text>

      <PasswordInput
        label="Mật khẩu hiện tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <PasswordInput
        label="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <PasswordInput
        label="Xác nhận mật khẩu mới"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#93C5FD" : "#2563EB",
          padding: 14,
          borderRadius: 8,
          marginTop: 24,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
          >
            Xác nhận đổi mật khẩu
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function PasswordInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 6, color: "#374151", fontWeight: "500" }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: "#F9FAFB",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 12,
          }}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
        />
        <TouchableOpacity onPress={() => setVisible(!visible)}>
          <MaterialIcons
            name={visible ? "visibility" : "visibility-off"}
            size={22}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
