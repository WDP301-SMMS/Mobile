import React, { createContext, useContext, useEffect, useState } from "react";

let notifyNewMessageListeners: (() => void)[] = [];

export const emitNewNotification = () => {
  for (const listener of notifyNewMessageListeners) {
    listener();
  }
};

const NotificationContext = createContext<{
  hasNewNotification: boolean;
  setHasNewNotification: (value: boolean) => void;
}>(undefined!);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    const listener = () => {
      // console.log("🔔 Đã nhận sự kiện từ foreground message");
      setHasNewNotification(true);
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
      value={{ hasNewNotification, setHasNewNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
