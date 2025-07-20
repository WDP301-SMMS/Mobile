import { useAuthen } from "@/libs/hooks/useAuthen";
import { useAppDispatch } from "@/libs/stores";
import {
  forgotPass,
  resetPass,
  verifyOtp,
} from "@/libs/stores/authenManager/thunk";
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

type FullFormData = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

// --- Schemas ---
const emailSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập email" })
    .nonempty("Vui lòng nhập email")
    .email("Email không hợp lệ"),
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

const formSteps: {
  step: number;
  schema: z.ZodType<any>;
  defaultValues: Partial<FullFormData>;
}[] = [
  { step: 1, schema: emailSchema, defaultValues: { email: "" } },
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
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAuthen();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep === 2 && countdown > 0) {
      setCanResend(false);
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }

    return () => clearTimeout(timer);
  }, [currentStep, countdown]);

  const handleResendOtp = async () => {
    if (!email) return;

    try {
      await dispatch(forgotPass({ email }));
      Alert.alert("Thành công", "Đã gửi lại mã xác nhận.");
      setCountdown(60);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi lại mã.");
    }
  };

  const currentForm = formSteps.find((form) => form.step === currentStep)!;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<Partial<FullFormData>>({
    resolver: zodResolver(currentForm.schema as z.ZodType<any, any, any>),
    defaultValues: currentForm.defaultValues,
  });

  useEffect(() => {
    reset(currentForm.defaultValues);
  }, [currentStep, reset]);

  const handleNextStep = async (data: any) => {
    const isValid = await trigger();
    if (!isValid) return;

    try {
      if (currentStep === 1) {
        const fullData = { email: data.email };
        const res = await dispatch(forgotPass(fullData)).unwrap();

        setEmail(data.email);
        setCurrentStep(2);
        setCountdown(60);
      } else if (currentStep === 2) {
        const fullData = {
          email,
          token: data.otp,
        };

        const res = await dispatch(verifyOtp(fullData)).unwrap();
        const resetTokenFromAPI = res?.data?.resetToken;

        if (resetTokenFromAPI) {
          setResetToken(resetTokenFromAPI);
          setCurrentStep(3);
        } else {
          Alert.alert("Lỗi", "Xác minh OTP thất bại");
        }
      } else if (currentStep === 3) {
        const fullData = {
          email,
          resetToken,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmPassword,
        };

        await dispatch(resetPass(fullData)).unwrap();
        Alert.alert("Thành công", "Mật khẩu đã được đặt lại");
        router.replace("/(auth)/signin");
      }
    } catch (err: any) {
      const message = err?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
      Alert.alert("Lỗi", message);
    }
  };

  const getProgress = () =>
    currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

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

          {/* Progress */}
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

          {/* Step 1: Email */}
          {currentStep === 1 && (
            <View className="w-full">
              <Text className="text-base text-gray-600 mb-4 text-center">
                Vui lòng nhập email để nhận mã xác nhận.
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
                    <Ionicons name="mail-outline" size={20} color="#6b7280" />
                    <TextInput
                      placeholder="Email"
                      className="flex-1 ml-2 text-base text-gray-800"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm pt-1">
                  {errors.email.message?.toString()}
                </Text>
              )}
              <TouchableOpacity
                className="bg-primary py-3 rounded-full w-full mt-6 shadow-md active:opacity-80 items-center"
                onPress={handleSubmit(handleNextStep)}
                disabled={loading}
              >
                {loading ? (
                  <Text className="text-white font-semibold text-lg">
                    Đang gửi...
                  </Text>
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    Gửi mã xác nhận
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: OTP */}
          {currentStep === 2 && (
            <View className="w-full">
              <Text className="text-base text-gray-600 mb-4 text-center">
                Nhập mã OTP được gửi đến email.
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
              {errors.otp && (
                <Text className="text-red-500 text-sm pt-1">
                  {errors.otp.message?.toString()}
                </Text>
              )}
              <TouchableOpacity
                className="bg-primary py-3 rounded-full w-full mt-6 shadow-md active:opacity-80 items-center"
                onPress={handleSubmit(handleNextStep)}
                disabled={loading}
              >
                {loading ? (
                  <Text className="text-white font-semibold text-lg">
                    Đang xác minh...
                  </Text>
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    Xác nhận
                  </Text>
                )}
              </TouchableOpacity>
              <View className="mt-4">
                {canResend ? (
                  <TouchableOpacity onPress={handleResendOtp} className="py-2">
                    <Text className="text-center text-primary font-semibold">
                      Gửi lại mã xác nhận
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text className="text-center text-gray-500">
                    Bạn có thể gửi lại mã sau {countdown}s
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Step 3: New Password */}
          {currentStep === 3 && (
            <View className="w-full">
              <Text className="text-base text-gray-600 mb-4 text-center">
                Nhập mật khẩu mới cho tài khoản của bạn.
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
              {errors.newPassword && (
                <Text className="text-red-500 text-sm pt-1">
                  {errors.newPassword.message?.toString()}
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
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm pt-1">
                  {errors.confirmPassword.message?.toString()}
                </Text>
              )}
              <TouchableOpacity
                className="bg-primary py-3 rounded-full w-full mt-6 shadow-md active:opacity-80 items-center"
                onPress={handleSubmit(handleNextStep)}
                disabled={loading}
              >
                {loading ? (
                  <Text className="text-white font-semibold text-lg">
                    Đang đặt lại...
                  </Text>
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    Đặt lại mật khẩu
                  </Text>
                )}
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
