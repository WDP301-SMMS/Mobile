import { useAuthen } from "@/libs/hooks/useAuthen";
import { useAppDispatch } from "@/libs/stores";
import { register } from "@/libs/stores/authenManager/thunk";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { z } from "zod";

const registerSchema = z
  .object({
    username: z.string().nonempty("Vui lòng nhập tên đăng nhập"),
    email: z.string().email("Email không hợp lệ"),
    dob: z.string().nonempty("Vui lòng chọn ngày sinh"),
    phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const { loading } = useAuthen();
  const dispatch = useAppDispatch();

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const dob = watch("dob");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await dispatch(register(data)).unwrap();
      Alert.alert(
        "Thành công",
        "Bạn đã đăng ký thành công! Vui lòng xác nhận thông qua email bạn đã đăng ký"
      );
      setTimeout(() => {
        router.push("/(auth)/signin");
      }, 5000);
    } catch (err: any) {
      Alert.alert("Lỗi đăng ký", err);
    }
  };

  const handleDateConfirm = (date: Date) => {
    setValue("dob", dayjs(date).format("DD/MM/YYYY"));
    setDateVisible(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-6 py-8">
          <Image
            source={require("@/assets/images/splash-icon-blue.png")}
            className="w-52 h-52 mb-4"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-primary mb-6">
            Đăng ký phụ huynh
          </Text>

          <InputField
            icon="person-outline"
            placeholder="Tên đăng nhập"
            onChangeText={(text) => setValue("username", text)}
            error={errors.username?.message}
          />

          <InputField
            icon="mail-outline"
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(text) => setValue("email", text)}
            error={errors.email?.message}
          />

          <TouchableOpacity
            onPress={() => setDateVisible(true)}
            className="w-full mb-4"
          >
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4 bg-gray-50">
              <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              <Text className="ml-2 text-base text-gray-800">
                {dob || "Chọn ngày sinh"}
              </Text>
            </View>
            {errors.dob && (
              <Text className="text-red-500 text-sm pt-1">
                {errors.dob.message}
              </Text>
            )}
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={dateVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setDateVisible(false)}
          />

          <InputField
            icon="call-outline"
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            onChangeText={(text) => setValue("phone", text)}
            error={errors.phone?.message}
          />

          <InputField
            icon="lock-closed-outline"
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword}
            onChangeText={(text) => setValue("password", text)}
            error={errors.password?.message}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            }
          />

          <InputField
            icon="lock-closed-outline"
            placeholder="Xác nhận mật khẩu"
            secureTextEntry={!showConfirmPassword}
            onChangeText={(text) => setValue("confirmPassword", text)}
            error={errors.confirmPassword?.message}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            className="bg-primary py-3 rounded-full w-full mb-4 shadow-md active:opacity-80"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Đăng ký
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
              <Text className="text-primary font-medium">Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({
  icon,
  placeholder,
  secureTextEntry,
  keyboardType,
  onChangeText,
  error,
  rightIcon,
}: {
  icon: any;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  onChangeText: (text: string) => void;
  error?: string;
  rightIcon?: React.ReactNode;
}) {
  return (
    <View className="w-full mb-4">
      <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
        <Ionicons name={icon} size={20} color="#6b7280" />
        <TextInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          className="flex-1 ml-2 text-base text-gray-800"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          onChangeText={onChangeText}
        />
        {rightIcon}
      </View>
      {error && <Text className="text-red-500 text-sm pt-1">{error}</Text>}
    </View>
  );
}
