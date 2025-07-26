import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io("https://b83d017c3f1f.ngrok-free.app", {
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