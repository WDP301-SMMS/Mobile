import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useConsent = () => {
  const { loading, consents, consentDetail } = useSelector(
    (state: RootState) => state.manageConsent
  );
  return { loading, consents, consentDetail };
};
