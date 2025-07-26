import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(`${process.env.EXPO_PUBLIC_BASE_URL}`, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return { socket };
};
