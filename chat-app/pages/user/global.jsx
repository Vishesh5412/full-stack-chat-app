import React, { useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import GlobalChatBox from "../../components/global/GlobalChatBox";
import MessageInput from "../../components/MessageInput";
import { getSocket } from "../../lib/socket";

import useAuthStore from "../../store/useAuthStore";
import useGlobalChatStore from "../../store/useGlobalChatStore";

import connectToDatabase from '../../config/mongoose'
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

const GlobalChat = ({ authUser }) => {
    const bottomRef = useRef();
  const socket = getSocket();

  const {  setAuthUser } = useAuthStore();
  const { getMessages, globalMessages, setMessagesGlobally } = useGlobalChatStore();

  useEffect(() => {
    setAuthUser(authUser);
  }, [authUser]);

  useEffect(() => {
   getMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);
  
  const roomId = "global-room";
  useEffect(() => {
    socket.emit("join-room", roomId);
  });

  //give line is listening for newMessage from the server
  useEffect(() => {
    socket.on("globalMessage", (message) => {
      console.log("📩 Received:", message);
      setMessagesGlobally(message);
    });

    return () => socket.off("globalMessage");
  }, [roomId]);
  return (
    <div className="w-full h-screen bg-[var(--dusty-bg)]">
        <GlobalChatBox  />
    </div>
  );
};

export default GlobalChat;
