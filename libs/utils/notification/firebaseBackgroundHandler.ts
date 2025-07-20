import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🔄 Background message:', remoteMessage);
  // (Có thể xử lý thêm hoặc lưu notification vào storage)
});
