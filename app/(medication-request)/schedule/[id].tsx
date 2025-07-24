import { useRequest } from "@/libs/hooks/useRequest";
import { useAppDispatch } from "@/libs/stores";
import {
    getRequestDetail,
    getRequestSchedule,
} from "@/libs/stores/requestManager/thunk";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Text, View } from "react-native";

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { requestDetail, requestSchedule } = useRequest();

  useFocusEffect(
    useCallback(() => {
      dispatch(getRequestDetail(id as string));
      dispatch(getRequestSchedule(id as string));
    }, [dispatch])
  );

  //   console.log("request detail", requestDetail);
  //   console.log("request schedule", requestSchedule);

  return (
    <View>
      <Text>Detail</Text>
    </View>
  );
}
