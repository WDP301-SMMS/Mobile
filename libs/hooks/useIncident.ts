import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useIncident = () => {
  const { loading, incidents, incidentDetail, hasMore, page } = useSelector(
    (state: RootState) => state.manageIncident
  );
  return { loading, incidents, incidentDetail, hasMore, page };
};
