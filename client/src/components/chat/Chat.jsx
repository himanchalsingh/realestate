// import { useContext, useEffect, useRef, useState } from "react";
// import "./chat.scss";
// import { AuthContext } from "../../context/AuthContext";
// import apiRequest from "../../lib/apiRequest";
// import { format } from "timeago.js";
// import { SocketContext } from "../../context/SocketContext";
// import { useNotificationStore } from "../../lib/notificationStore";

// function Chat({ chats }) {
//   const [chat, setChat] = useState(null);
//   const { currentUser } = useContext(AuthContext);
//   const { socket } = useContext(SocketContext);

//   const messageEndRef = useRef();

//   const decrease = useNotificationStore((state) => state.decrease);

//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   const handleOpenChat = async (id, receiver) => {
//     try {
//       const res = await apiRequest("/chats/" + id);
//       if (!res.data.seenBy.includes(currentUser.id)) {
//         decrease();
//       }
//       setChat({ ...res.data, receiver });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);
//     const text = formData.get("text");

//     if (!text) return;
//     try {
//       const res = await apiRequest.post("/messages/" + chat.id, { text });
//       setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
//       e.target.reset();
//       socket.emit("sendMessage", {
//         receiverId: chat.receiver.id,
//         data: res.data,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     const read = async () => {
//       try {
//         await apiRequest.put("/chats/read/" + chat.id);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     if (chat && socket) {
//       socket.on("getMessage", (data) => {
//         if (chat.id === data.chatId) {
//           setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
//           read();
//         }
//       });
//     }
//     return () => {
//       socket.off("getMessage");
//     };
//   }, [socket, chat]);

//   return (
//     <div className="chat">
//       <div className="messages">
//         <h1>Messages</h1>
//         {chats?.map((c) => (
//           <div
//             className="message"
//             key={c.id}
//             style={{
//               backgroundColor:
//                 c.seenBy.includes(currentUser.id) || chat?.id === c.id
//                   ? "white"
//                   : "#fecd514e",
//             }}
//             onClick={() => handleOpenChat(c.id, c.receiver)}
//           >
//             <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
//             <span>{c.receiver.username}</span>
//             <p>{c.lastMessage}</p>
//           </div>
//         ))}
//       </div>
//       {chat && (
//         <div className="chatBox">
//           <div className="top">
//             <div className="user">
//               <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
//               {chat.receiver.username}
//             </div>
//             <span className="close" onClick={() => setChat(null)}>
//               X
//             </span>
//           </div>
//           <div className="center">
//             {chat.messages.map((message) => (
//               <div
//                 className="chatMessage"
//                 style={{
//                   alignSelf:
//                     message.userId === currentUser.id
//                       ? "flex-end"
//                       : "flex-start",
//                   textAlign:
//                     message.userId === currentUser.id ? "right" : "left",
//                 }}
//                 key={message.id}
//               >
//                 <p>{message.text}</p>
//                 <span>{format(message.createdAt)}</span>
//               </div>
//             ))}
//             <div ref={messageEndRef}></div>
//           </div>
//           <form onSubmit={handleSubmit} className="bottom">
//             <textarea name="text"></textarea>
//             <button>Send</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Chat;

import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log("Error opening chat:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text").trim();

    if (!text) return;

    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();

      socket?.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  // Listen for incoming messages from socket
  useEffect(() => {
    if (!socket || !chat) return;

    const handleMessage = (data) => {
      if (data.chatId === chat.id) {
        setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));

        // Mark chat as read on arrival
        apiRequest
          .put("/chats/read/" + chat.id)
          .catch((err) => console.log("Read update failed:", err));
      }
    };

    socket.on("getMessage", handleMessage);

    return () => {
      socket.off("getMessage", handleMessage);
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              ✖
            </span>
          </div>

          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Type a message..." />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
