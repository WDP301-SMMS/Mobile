import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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

const phoneSchema = z.object({
  phone: z
    .string({ required_error: "Vui lòng nhập số điện thoại" })
    .nonempty("Vui lòng nhập số điện thoại")
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
});

const otpSchema = z.object({
  otp: z
    .string({ required_error: "Vui lòng nhập mã xác nhận" })
    .nonempty("Vui lòng nhập mã xác nhận")
    .length(6, "Mã xác nhận phải có 6 chữ số"),
});

const newPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Vui lòng nhập mật khẩu mới" })
      .nonempty("Vui lòng nhập mật khẩu mới")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z
      .string({ required_error: "Vui lòng xác nhận mật khẩu" })
      .nonempty("Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;

type FormStep = {
  step: number;
  schema: z.ZodObject<any> | z.ZodEffects<z.ZodObject<any>>;
  defaultValues: any;
};

const formSteps: FormStep[] = [
  { step: 1, schema: phoneSchema, defaultValues: { phone: "" } },
  { step: 2, schema: otpSchema, defaultValues: { otp: "" } },
  {
    step: 3,
    schema: newPasswordSchema,
    defaultValues: { newPassword: "", confirmPassword: "" },
  },
];

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const currentForm = formSteps.find((form) => form.step === currentStep)!;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(currentForm.schema),
    defaultValues: currentForm.defaultValues,
  });

  useEffect(() => {
    reset(currentForm.defaultValues);
  }, [currentStep, reset]);

  const getProgress = () => {
    switch (currentStep) {
      case 1:
        return 33;
      case 2:
        return 66;
      case 3:
        return 100;
      default:
        return 0;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Nhập Số Điện Thoại";
      case 2:
        return "Nhập Mã Xác Nhận (OTP)";
      case 3:
        return "Đặt Mật Khẩu Mới";
      default:
        return "";
    }
  };

  const handleNextStep = async (data: any) => {
    const isValid = await trigger();
    if (!isValid) {
      console.log("Validation errors:", errors);
      return;
    }

    try {
      if (currentStep === 1) {
        Alert.alert(
          "Thành công",
          `Mã OTP đã được gửi tới số điện thoại ${(data as PhoneForm).phone}`
        );
        setCurrentStep(2);
      } else if (currentStep === 2) {
        if ((data as OtpForm).otp === "123456") {
          Alert.alert("Thành công", "Mã OTP hợp lệ.");
          setCurrentStep(3);
        } else {
          Alert.alert("Lỗi", "Mã OTP không đúng. Vui lòng thử lại.");
        }
      } else if (currentStep === 3) {
        Alert.alert("Thành công", "Mật khẩu của bạn đã được đặt lại.");
        router.replace("/(auth)/signin");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
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
            className="w-32 h-32 mb-4"
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold text-primary mb-8">
            Quên Mật Khẩu
          </Text>

          <View className="w-full mb-6">
            <View className="h-2 bg-gray-200 rounded-full mb-2">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${getProgress()}%` }}
              />
            </View>
            <Text className="text-sm font-semibold text-gray-700 text-center">
              Bước {currentStep}
            </Text>
          </View>

          {currentStep === 1 && (
            <View className="w-full">
              <Text className="text-base text-gray-600 mb-4 text-center">
                Vui lòng nhập số điện thoại bạn đã đăng ký để nhận mã xác nhận.
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
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
                      value={value}
                      onChangeText={onChange}
                      numberOfLines={1}
                    />
                  </View>
                )}
              />
              {errors.phone && typeof errors.phone.message === "string" && (
                <Text className="text-red-500 text-sm pt-1">
                  {errors.phone.message}
                </Text>
              )}
              <TouchableOpacity
                className="bg-primary py-3 rounded-full w-full mt-6 shadow-md active:opacity-80"
                onPress={handleSubmit(handleNextStep)}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Gửi mã xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {currentStep === 2 && (
            <View className="w-full">
              <Text className="text-base text-gray-600 mb-4 text-center">
                Mã xác nhận đã được gửi đến số điện thoại của bạn. Vui lòng kiểm
                tra tin nhắn.
              </Text>
              <Controller
                control={control}
                name="otp"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
                    <Ionicons name="key-outline" size={20} color="#6b7280" />
                    <TextInput
                      placeholder="Mã xác nhận (OTP)"
                      className="flex-1 ml-2 text-base text-gray-800 text-center tracking-widest"
                      placeholderTextColor="#9ca3af"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.otp && typeof errors.otp.message === "string" && (
                <Text className="text-red-500 text-sm pt-1">
                  {errors.otp.message}
                </Text>
              )}
              <TouchableOpacity
                className="bg-primary py-3 rounded-full w-full mt-6 shadow-md active:opacity-80"
                onPress={handleSubmit(handleNextStep)}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Xác nhận
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mt-4 p-2"
                onPress={() =>
                  Alert.alert(
                    "Gửi lại OTP",
                    "Chức năng gửi lại OTP sẽ được triển khai."
                  )
                }
              >
                <Text className="text-primary text-center font-medium">
                  Gửi lại mã xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {currentStep === 3 && (
            <View className="w-full">
              <Text className="text-base text-gray-600 mb-4 text-center">
                Vui lòng đặt mật khẩu mới cho tài khoản của bạn.
              </Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 mb-4">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#6b7280"
                    />
                    <TextInput
                      placeholder="Mật khẩu mới"
                      secureTextEntry={!showNewPassword}
                      className="flex-1 ml-2 text-base text-gray-800"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      numberOfLines={1}
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Ionicons
                        name={
                          showNewPassword ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.newPassword &&
                typeof errors.newPassword.message === "string" && (
                  <Text className="text-red-500 text-sm pt-1">
                    {errors.newPassword.message}
                  </Text>
                )}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#6b7280"
                    />
                    <TextInput
                      placeholder="Xác nhận mật khẩu mới"
                      secureTextEntry={!showConfirmPassword}
                      className="flex-1 ml-2 text-base text-gray-800"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      numberOfLines={1}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.confirmPassword &&
                typeof errors.confirmPassword.message === "string" && (
                  <Text className="text-red-500 text-sm pt-1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              <TouchableOpacity
                className="bg-primary py-3 rounded-full w-full mt-6 shadow-md active:opacity-80"
                onPress={handleSubmit(handleNextStep)}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Đặt lại mật khẩu
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Link href={"/(auth)/signin"} asChild>
            <TouchableOpacity className="bg-white border border-primary py-3 rounded-full w-full mt-6 shadow-md active:opacity-80">
              <Text className="text-primary text-center font-semibold text-lg">
                Quay lại
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
