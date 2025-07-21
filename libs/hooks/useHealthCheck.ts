import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useHealthCheck = () => {
  const { loading, consents, consentDetail } = useSelector(
    (state: RootState) => state.manageHealthCheck
  );
  return { loading, consents, consentDetail };
};
