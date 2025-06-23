import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useUser = () => {
  const { loading, info } = useSelector((state: RootState) => state.manageUser);
  return { loading, info };
};
