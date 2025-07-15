import { useEffect, useInsertionEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import NoChatSelected from "../../components/NoChatSelected";
import ChatBox from "../../components/ChatBox";

import useAuthStore from "../../store/useAuthStore";
import useChatStore from "../../store/useChatStore";
import SidebarSkeleton from "../../components/Skeleton/SideBarSkeleton";

import { getSocket } from "../../lib/socket";

import connectToDatabase from "../../config/mongoose";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { notFound } from "next/navigation";
import UserModel from "../../models/UserModel";

export async function getServerSideProps({ req }) {
  await connectToDatabase();

  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.authToken;

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userid;
    if (!userId) {
      return { notFound: true };
    }
    const authUser = await UserModel.findById(userId).select("-password");
    return {
      props: {
        authUser: JSON.parse(JSON.stringify(authUser)),
      },
    };
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

const ChatPage = ({ authUser }) => {
  const Users = [];
  const socket = getSocket();
  const { setSelectedUser, selectedUser, setMessages } = useChatStore();
  const { setAuthUser } = useAuthStore();

  const authId = authUser ? authUser._id : "";

  useEffect(() => {
    setAuthUser(authUser);
  }, [authUser]);

  const roomId = useMemo(() => {
    if (!authId || !selectedUser?._id) return null;
    return [authId, selectedUser._id].sort().join("-");
  }, [authId, selectedUser]);
  //it means it will recalculate the roomId if either of dependency changes

  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  //given line is listening for newMessage from the server
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages(message);
    });

    return () => socket.off("newMessage");
  }, [roomId]);

  /**to find whether screen size is suitable for phone or not**/
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize); // Listen to window resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen bg-gray-400">
      {isMobile && selectedUser ? (
        <>
          <ChatBox />
        </>
      ) : (
        <>
          <Navbar />
          <div className="flex w-screen justify-center ">
            <div className="flex w-[calc(100vw-0px)] my-1 h-[calc(100vh-65px)] justify-center ">
              <div className="w-full md:w-auto md:min-w-[350px] ">
                <Sidebar />
              </div>

              <div className="h-full bg-transparent md:w-1"></div>

              <div className="flex-1 w-0 hidden md:w-full md:block min-w-0">
                {selectedUser ? <ChatBox /> : <NoChatSelected />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
