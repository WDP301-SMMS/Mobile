import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useMessage = () => {
  const { loading, availableUser, messageRoom, message } = useSelector(
    (state: RootState) => state.manageMessage
  );
  return { loading, availableUser, messageRoom, message };
};
