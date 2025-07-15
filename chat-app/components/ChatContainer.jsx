import React, { useEffect, useState, useRef } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import convertIso from "../utils/extractTime";

const ChatContainer = () => {
  const { messages, selectedUser, isChatLoaded } = useChatStore();

  const bottomRef = useRef(null);
  useEffect(() => {
    if (!isChatLoaded && messages?.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      console.log("Scrolled to bottom");
    }
  }, [isChatLoaded, messages?.length]);

  const { authUser } = useAuthStore();
  return (
    <div className="w-full h-full overflow-scroll px-2 md:px-3 pb-[100px] ">
      {messages?.length === 0 ? (
        <div className="h-full w-full text-white text-center content-center text-2xl">
          No chat yet..
        </div>
      ) : (
        <div>
          {messages?.map((message, idx) => (
            <div
              className={`text-white  flex flex-col py-2 gap-1 ${
                message.senderId === selectedUser._id
                  ? "items-start"
                  : "items-end"
              }`}
              key={idx}
            >
              <div
                className={`flex  gap-2 ${
                  message.senderId === selectedUser._id
                    ? "flex-row"
                    : "flex-row-reverse"
                }`}
              >
                <div
                  className={`flex flex-col ${
                    message.senderId === selectedUser._id
                      ? "bg-neutral-600  rounded-e-xl rounded-es-xl"
                      : "bg-slate-700 rounded-s-xl rounded-t-xl"
                  } justify-center`}
                >
                  <div className="px-2 py-1">
                    {message?.imageUrl !== "" && (
                      <img
                        src={message.imageUrl}
                        alt=""
                        className="h-40 rounded-lg border border-gray-400"
                      />
                    )}
                  </div>
                  <div className="content-center px-2 rounded-xl min-w-[80px]">
                    {message.content}
                    <p className="text-xs text-gray-400 text-end">
                      {convertIso(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
