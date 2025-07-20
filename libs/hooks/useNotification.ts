import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useNotification = () => {
  const { loading, notifications, countUnread } = useSelector(
    (state: RootState) => state.manageNotification
  );
  return { loading, notifications: notifications ?? [], countUnread };
};
