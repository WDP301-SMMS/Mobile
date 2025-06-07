import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  phone: z
    .string({ required_error: "Vui lòng nhập số điện thoại" })
    .nonempty("Vui lòng nhập số điện thoại")
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .nonempty("Vui lòng nhập mật khẩu"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function SignInScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      router.push("/(tabs)");
    } catch (error: any) {
      Alert.alert("Đăng nhập thất bại", error);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Image
        source={require("@/assets/images/splash-icon-blue.png")}
        className="w-40 h-40 mb-4"
        resizeMode="contain"
      />

      <Text className="text-3xl font-bold text-primary mb-8">Đăng nhập</Text>

      <View className="w-full mb-4">
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
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
          />
        </View>
        {errors.phone && (
          <Text className="text-red-500 text-sm pt-1">
            {errors.phone.message}
          </Text>
        )}
      </View>

      <View className="w-full mb-6">
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword}
            className="flex-1 ml-2 text-base text-gray-800"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            onChangeText={(text) => setValue("password", text)}
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

      <TouchableOpacity
        className="bg-primary py-3 rounded-full w-full mb-4 shadow-md active:opacity-80"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Đăng nhập
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
  );
}
