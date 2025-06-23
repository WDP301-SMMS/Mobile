import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      const storedToken = await SecureStore.getItemAsync("authToken");
      const role = await SecureStore.getItemAsync("role");
      if (storedToken) {
        if (role === "Parent") {
          router.push("/(tabs)");
        }
      } else {
        router.replace("/(auth)");
      }
    };
    const timeout = setTimeout(() => {
      setReady(true);
      checkTokenAndNavigate();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      className="bg-white"
    >
      <Image
        source={require("@/assets/images/splash-icon-blue.png")}
        style={{ width: 200, height: 200, resizeMode: "contain" }}
      />
    </View>
  );
}
