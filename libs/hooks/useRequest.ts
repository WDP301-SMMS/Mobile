import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useRequest = () => {
  const { loading, requests, requestDetail, requestSchedule, hasMore, page } =
    useSelector((state: RootState) => state.manageRequest);
  return { loading, requests, requestDetail, requestSchedule, hasMore, page };
};
