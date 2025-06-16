// // socket.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const socketRef = useRef(null); // Store socket persistently
  const [socket, setSocket] = useState(null); // Safe to expose after connect

  useEffect(() => {
    if (!socketRef.current) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        console.log("✅ Socket connected:", newSocket.id);
        setSocket(newSocket); // Expose only after connect
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setSocket(null); // Cleanup
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        console.log("🧹 Socket cleaned up");
      }
    };
  }, []);

  useEffect(() => {
    if (currentUser && socket) {
      socket.emit("newUser", currentUser.id);
      console.log("📢 Emitted newUser:", currentUser.id);
    }
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
