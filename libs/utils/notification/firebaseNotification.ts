import { emitNewNotification } from "@/libs/context/NotificationContext";
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from "@notifee/react-native";

import {
  getMessaging,
  getToken,
  onMessage,
} from "@react-native-firebase/messaging";

export async function requestPermissionAndGetToken(): Promise<string | null> {
  const settings = await notifee.requestPermission();

  if (
    settings.authorizationStatus === AuthorizationStatus.DENIED ||
    settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
  ) {
    // console.log("❌ Người dùng từ chối quyền thông báo.");
    return null;
  }

  //   console.log("✅ Quyền thông báo được cấp:", settings.authorizationStatus);

  const token = await getToken(getMessaging());
  //   console.log("✅ FCM token:", token);
  return token;
}

export function listenToForegroundMessages() {
  const messaging = getMessaging();

  onMessage(messaging, async (remoteMessage) => {
    // console.log("📥 Foreground message:", remoteMessage);

    emitNewNotification();

    const settings = await notifee.getNotificationSettings();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      await notifee.displayNotification({
        title: String(
          remoteMessage.notification?.title ||
            remoteMessage.data?.title ||
            "Thông báo"
        ),
        body: String(
          remoteMessage.notification?.body ||
            remoteMessage.data?.body ||
            "Bạn có thông báo mới"
        ),
        android: {
          channelId: "default",
          smallIcon: "ic_launcher",
          importance: AndroidImportance.HIGH,
        },
      });
    }
  });
}
