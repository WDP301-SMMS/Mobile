import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useNotification = () => {
  const { loading, notifications, countUnread, attentionNotifications } = useSelector(
    (state: RootState) => state.manageNotification
  );
  return { loading, notifications: notifications ?? [], countUnread, attentionNotifications: attentionNotifications ?? [] };
};
