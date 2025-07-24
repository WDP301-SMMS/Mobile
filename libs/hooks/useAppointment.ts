import { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

export const useAppointment = () => {
  const { loading, appointments, appointmentDetail, hasMore, page } =
    useSelector((state: RootState) => state.manageAppointment);
  return { loading, appointments, appointmentDetail, hasMore, page };
};
