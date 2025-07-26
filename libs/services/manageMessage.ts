import api from "@/libs/hooks/axiosInstance";

export const manageMessage = {
  getAvailableUsers: () => api.get(`/messages/available-users`),
  createMessageRoom: (participantId: string) =>
    api.post(`/messages/room/create`, { participantId }),
  getAllMessageRoom: (req: string) => api.get(`/messages/user/${req}`),
  getMessageRoom: (req: string) => api.get(`/messages/${req}`),
  uploadImage: (formData: FormData) =>
    api.post(`/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
