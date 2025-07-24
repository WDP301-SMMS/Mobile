import notifee, { AndroidImportance } from "@notifee/react-native";

export async function createNotificationChannel() {
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
    sound: "default",
  });
}
