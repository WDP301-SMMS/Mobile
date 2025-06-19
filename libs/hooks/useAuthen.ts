import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useAuthen = () => {
  const { loading } = useSelector((state: RootState) => state.manageAuthen);
  return { loading };
};
