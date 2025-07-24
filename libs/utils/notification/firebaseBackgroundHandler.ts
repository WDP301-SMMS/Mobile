import notifee from "@notifee/react-native";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

const messaging = getMessaging();

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  console.log("🔄 Background message:", remoteMessage);

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
      sound: "default",
    },
  });
});
