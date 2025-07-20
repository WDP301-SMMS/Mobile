import React, { createContext, useContext, useEffect, useState } from "react";

type NotificationType = "CHAT_MESSAGE_NEW" | string | undefined;
type NotificationListener = (type?: NotificationType) => void;

let notifyNewMessageListeners: NotificationListener[] = [];

export const emitNewNotification = (type?: NotificationType) => {
  for (const listener of notifyNewMessageListeners) {
    listener(type);
  }
};

interface NotificationContextType {
  hasNewNotification: boolean;
  setHasNewNotification: (value: boolean) => void;
  hasNewMessage: boolean;
  setHasNewMessage: (value: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType>(undefined!);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    const listener: NotificationListener = (type?: NotificationType) => {
      if (type === "CHAT_MESSAGE_NEW") {
        setHasNewMessage(true);
      } else {
        setHasNewNotification(true);
      }
    };

    notifyNewMessageListeners.push(listener);

    return () => {
      notifyNewMessageListeners = notifyNewMessageListeners.filter(
        (l) => l !== listener
      );
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        hasNewNotification,
        setHasNewNotification,
        hasNewMessage,
        setHasNewMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
