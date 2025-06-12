import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { z } from "zod";

const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: "Vui lòng nhập họ và tên của bạn" })
      .nonempty("Vui lòng nhập họ và tên của bạn"),
    phone: z
      .string({ required_error: "Vui lòng nhập số điện thoại liên hệ của bạn" })
      .nonempty("Vui lòng nhập số điện thoại liên hệ của bạn")
      .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
    password: z
      .string({ required_error: "Vui lòng nhập mật khẩu" })
      .nonempty("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z
      .string({ required_error: "Vui lòng xác nhận mật khẩu" })
      .nonempty("Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterParentScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      Alert.alert(
        "Đăng ký thành công",
        "Bạn đã đăng ký thành công, vui lòng đăng nhập."
      );
      router.push("/(auth)/signin");
    } catch (error: any) {
      Alert.alert("Đăng ký thất bại", error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center px-6 py-8">
          <Image
            source={require("@/assets/images/splash-icon-blue.png")}
            className="w-64 h-64 mb-4"
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold text-primary mb-8">
            Đăng ký phụ huynh
          </Text>

          <View className="w-full mb-4">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
              <Ionicons
                name="person-outline"
                size={20}
                color="#6b7280"
                className="mr-2"
              />
              <TextInput
                placeholder="Họ và tên"
                className="flex-1 text-base text-gray-800"
                placeholderTextColor="#9ca3af"
                onChangeText={(text) => setValue("fullName", text)}
                numberOfLines={1}
              />
            </View>
            {errors.fullName && (
              <Text className="text-red-500 text-sm pt-1">
                {errors.fullName.message}
              </Text>
            )}
          </View>

          <View className="w-full mb-4">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
              <Ionicons
                name="call-outline"
                size={20}
                color="#6b7280"
                className="mr-2"
              />
              <TextInput
                placeholder="Số điện thoại"
                className="flex-1 text-base text-gray-800"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                autoCapitalize="none"
                onChangeText={(text) => setValue("phone", text)}
                numberOfLines={1}
              />
            </View>
            {errors.phone && (
              <Text className="text-red-500 text-sm pt-1">
                {errors.phone.message}
              </Text>
            )}
          </View>

          <View className="w-full mb-4">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
              <TextInput
                placeholder="Mật khẩu"
                secureTextEntry={!showPassword}
                className="flex-1 ml-2 text-base text-gray-800"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                onChangeText={(text) => setValue("password", text)}
                numberOfLines={1}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-sm pt-1">
                {errors.password.message}
              </Text>
            )}
          </View>

          <View className="w-full mb-6">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
              <TextInput
                placeholder="Xác nhận mật khẩu"
                secureTextEntry={!showConfirmPassword}
                className="flex-1 ml-2 text-base text-gray-800"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                onChangeText={(text) => setValue("confirmPassword", text)}
                numberOfLines={1}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm pt-1">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="bg-primary py-2 rounded-full w-full mb-4 shadow-md active:opacity-80"
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
