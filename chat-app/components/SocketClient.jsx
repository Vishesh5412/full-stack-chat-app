import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";

export default function SocketClient() {
  const { authUser } = useAuthStore();
  const { onlineUsers, setOnlineUsers } = useChatStore();

  useEffect(() => {
    if (!authUser?._id) return;

    const socket = getSocket();

    // Ensure socket is connected before emitting anything
    socket.connect();

    // ✅ Emit user ID after connection is established
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("user-connected", authUser._id);
    });

    // ✅ Listen for online users from server
    socket.on("online-users", (users) => {
      // console.log("ONliusers are", users);
      setOnlineUsers(users);
    });

    // ✅ Cleanup
    return () => {
      socket.off("online-users");
      socket.disconnect();
    };
  }, [authUser?._id]);

  return null;
}

//socket.on used to client side to receive message from server
