// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { AuthContext } from "./AuthContext";

// export const SocketContext = createContext();

// export const SocketContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     setSocket(io("http://localhost:5000"));
//   }, []);

//   useEffect(() => {
//     currentUser && socket?.emit("newUser", currentUser.id);
//   }, [currentUser, socket]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// // import { createContext, useContext, useEffect, useState } from "react";
// // import { io } from "socket.io-client";
// // import { AuthContext } from "./AuthContext";

// // export const SocketContext = createContext();

// // export const SocketContextProvider = ({ children }) => {
// //   const { currentUser } = useContext(AuthContext);
// //   const [socket, setSocket] = useState(null);

// //   useEffect(() => {
// //     const newSocket = io("http://localhost:4000", {
// //       withCredentials: true,
// //       transports: ["websocket", "polling"],
// //     });
// //     setSocket(newSocket);

// //     // Optional cleanup
// //     return () => {
// //       newSocket.disconnect();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (currentUser && socket) {
// //       socket.emit("newUser", currentUser.id);
// //     }
// //   }, [currentUser, socket]);

// //   return (
// //     <SocketContext.Provider value={{ socket }}>
// //       {children}
// //     </SocketContext.Provider>
// //   );
// // };
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const socketRef = useRef(null); // UseRef prevents duplicate connections
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect only once
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketRef.current.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (currentUser && isConnected && socketRef.current) {
      socketRef.current.emit("newUser", currentUser.id);
    }
  }, [currentUser, isConnected]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
