import { useAuth } from "@/libs/context/AuthContext";
import { useAuthen } from "@/libs/hooks/useAuthen";
import { useAppDispatch } from "@/libs/stores";
import { login } from "@/libs/stores/authenManager/thunk";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
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

const loginSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập email" })
    .nonempty("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .nonempty("Vui lòng nhập mật khẩu"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function SignInScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAuthen();
  const { reloadAuth } = useAuth();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await dispatch(login(data)).unwrap();
      await reloadAuth();

      const role = await SecureStore.getItemAsync("role");
      if (role === "Parent") {
        router.push("/(tabs)");
      } else {
        Alert.alert(
          "Lỗi",
          "Không xác định được vai trò người dùng hoặc vai trò không hợp lệ"
        );
      }
    } catch (err: any) {
      Alert.alert("Lỗi đăng nhập", err);
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
            Đăng nhập
          </Text>

          <View className="w-full mb-4">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
              <Ionicons
                name="mail-outline"
                size={20}
                color="#6b7280"
                className="mr-2"
              />
              <TextInput
                placeholder="Email"
                className="flex-1 text-base text-gray-800"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => setValue("email", text)}
                numberOfLines={1}
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-sm pt-1">
                {errors.email.message}
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

          <View className="w-full items-end mb-6">
            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-medium text-sm">
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <TouchableOpacity
            className="bg-primary py-3 rounded-full w-full mb-4 shadow-md active:opacity-80"
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? (
              <ActivityIndicator className="text-xl text-white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Đăng nhập
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-primary py-3 rounded-full w-full mb-4 shadow-md active:opacity-80 flex-row justify-center items-center">
            <Image
              source={require("@/assets/icons/google.png")}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text className="text-primary text-center font-semibold text-lg">
              Đăng nhập bằng google
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Chưa có tài khoản? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-medium">Đăng ký</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
