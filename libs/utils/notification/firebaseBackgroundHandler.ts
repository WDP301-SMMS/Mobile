import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🔄 Background message:', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || remoteMessage.data?.title,
    body: remoteMessage.notification?.body || remoteMessage.data?.body,
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
    },
  });
});
