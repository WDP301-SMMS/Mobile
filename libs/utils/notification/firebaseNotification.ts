import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

export async function getFcmToken() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) return null;

  const token = await messaging().getToken();
  console.log('✅ FCM token:', token);
  return token;
}

export function listenToForegroundMessages() {
  messaging().onMessage(async remoteMessage => {
    console.log('📥 Foreground message:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification?.title || remoteMessage.data?.title || 'Thông báo',
      body: remoteMessage.notification?.body || remoteMessage.data?.body || 'Bạn có thông báo mới',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher', // icon bạn đã cấu hình trong res/
        importance: AndroidImportance.HIGH,
      },
    });
  });
}
