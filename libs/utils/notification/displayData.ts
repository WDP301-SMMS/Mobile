/**
 * Dịch một object notification thô từ API thành dữ liệu có thể hiển thị.
 * @param {object} notification - Object notification từ backend.
 * @returns {object} - Gồm { title, body, link } để hiển thị trên UI.
 */
export function getNotificationDisplayData(notification: {
  type: string;
  entityId: string;
}) {
  let title = "Thông báo mới";
  let body = "Bạn có một thông báo từ hệ thống School Health.";
  let link = "/notifications";

  const { type, entityId } = notification;

  switch (type) {
    // === Phụ huynh ===
    case "VACCINATION_RECORD_CREATED":
      title = "Hồ sơ tiêm chủng mới";
      body =
        "Con của bạn vừa được cập nhật hồ sơ tiêm chủng. Vui lòng kiểm tra để biết thêm chi tiết.";
      link = `/vaccinations/${entityId}`;
      break;

    case "HEALTH_CHECK_CAMPAIGN_NEW":
      title = "Chiến dịch Khám sức khỏe";
      body =
        "Nhà trường đã gửi lời mời tham gia một chiến dịch khám sức khỏe mới.";
      link = `/health-checks/campaigns/${entityId}`;
      break;

    case "HEALTH_CHECK_RESULT_READY":
      title = "Kết quả Khám sức khỏe";
      body = "Kết quả khám sức khỏe của con bạn đã được cập nhật.";
      link = `/health-history/results/${entityId}`;
      break;

    case "VACCINE_CAMPAIGN_NEW":
      title = "Chiến dịch Tiêm chủng";
      body =
        "Nhà trường đã gửi lời mời tham gia một chiến dịch tiêm chủng mới.";
      link = `/vaccinations/campaigns/${entityId}`;
      break;

    case "MEDICATION_REQUEST_SCHEDULED":
      title = "Yêu cầu Cấp thuốc";
      body = "Yêu cầu cấp thuốc của bạn đã được y tá lên lịch.";
      link = `/medication-requests/${entityId}`;
      break;

    case "MEDICATION_REQUEST_COMPLETED":
      title = "Yêu cầu Cấp thuốc";
      body = "Quá trình cấp thuốc theo yêu cầu của bạn đã hoàn tất.";
      link = `/medication-requests/${entityId}`;
      break;

    case "MEDICATION_REQUEST_REJECTED":
      title = "Yêu cầu Cấp thuốc";
      body = "Yêu cầu cấp thuốc của bạn đã bị từ chối. Vui lòng xem chi tiết.";
      link = `/medication-requests/${entityId}`;
      break;

    case "MEETING_SCHEDULE_NEW":
      title = "Lịch hẹn Mới";
      body = "Bạn có một lịch hẹn mới với phòng y tế. Vui lòng xác nhận.";
      link = `/meetings/${entityId}`;
      break;

    case "MEETING_SCHEDULE_UPDATED":
      title = "Cập nhật Lịch hẹn";
      body = "Lịch hẹn của bạn với phòng y tế đã được cập nhật.";
      link = `/meetings/${entityId}`;
      break;

    case "MEETING_SCHEDULE_CANCELED":
      title = "Hủy Lịch hẹn";
      body = "Lịch hẹn của bạn với phòng y tế đã bị hủy.";
      link = `/meetings/${entityId}`;
      break;

    case "MEDICAL_INCIDENT_PARENT_ALERT":
      title = "Khẩn cấp: Sự cố y tế";
      body =
        "Con của bạn gặp sự cố y tế nghiêm trọng. Vui lòng kiểm tra ngay thông tin chi tiết.";
      link = `/meetings/${entityId}`;
      break;

    // === Y tá / quản lý ===
    case "PARENT_SUBMITTED_CONSENT":
      title = "Phản hồi từ Phụ huynh";
      body = "Một phụ huynh vừa gửi phản hồi cho một đơn đồng ý.";
      link = `/consents/${entityId}`;
      break;

    case "NEW_MEDICATION_REQUEST_RECEIVED":
      title = "Yêu cầu Cấp thuốc Mới";
      body = "Bạn vừa nhận được một yêu cầu cấp thuốc mới từ phụ huynh.";
      link = `/medication-requests/review/${entityId}`;
      break;

    case "MEDICAL_INCIDENT_NEW":
      title = "Sự cố Y tế Mới";
      body = "Một sự cố y tế vừa được ghi nhận trong hệ thống.";
      link = `/incidents/details/${entityId}`;
      break;

    case "INVENTORY_ITEM_LOW_STOCK":
      title = "Cảnh báo Tồn kho";
      body = "Một vật tư trong kho đang ở mức tồn kho thấp.";
      link = `/inventory/items/${entityId}`;
      break;

    // === Chat ===
    case "CHAT_MESSAGE_NEW":
      title = "Tin nhắn Mới";
      body = "Bạn có một tin nhắn mới.";
      link = `/chat/rooms/${entityId}`;
      break;

    default:
      console.warn(`Unknown notification type: ${type}`);
  }

  return { title, body, link };
}
