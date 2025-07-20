import PushNotification from 'react-native-push-notification';

export function createNotificationChannel() {
  PushNotification.createChannel(
    {
      channelId: 'default-channel-id',
      channelName: 'Default Channel',
      importance: 4,
    },
    created => console.log(`🔔 Channel created: ${created}`)
  );
}
