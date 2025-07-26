export const formatDateHeader = (isoDate: string) => {
  const now = new Date();
  const date = new Date(isoDate);

  const isToday =
    now.toDateString() === date.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    yesterday.toDateString() === date.toDateString();

  if (isToday) return "Hôm nay";
  if (isYesterday) return "Hôm qua";

  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};