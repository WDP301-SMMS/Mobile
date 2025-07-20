import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

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

    const { notification, data } = remoteMessage;

    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: notification?.title || data?.title || 'Thông báo',
      message: notification?.body || data?.body || 'Bạn có thông báo mới',
    });
  });
}
