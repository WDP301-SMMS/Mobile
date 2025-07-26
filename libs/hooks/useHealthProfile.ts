import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useHealthProfile = () => {
  const { loading, myChild, healthProfile, healthHistory } = useSelector(
    (state: RootState) => state.manageHealthProfile
  );
  return { loading, myChild, healthProfile, healthHistory };
};
