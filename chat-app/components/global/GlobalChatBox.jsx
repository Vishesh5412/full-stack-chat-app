import React, { useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import MessageInput from "../../components/MessageInput";
import useGlobalChatStore from "../../store/useGlobalChatStore";
import useAuthStore from "../../store/useAuthStore";
import ChatSkeleton from "../Skeleton/ChatSkeleton";
import convertIso from "../../utils/extractTime";
import Link from "next/link";
const GlobalChatBox = () => {
  const { authUser } = useAuthStore();
  const isChatLoaded = useGlobalChatStore((s) => s.isChatLoaded);
  const globalMessages = useGlobalChatStore((s) => s.globalMessages);

  const bottomRef = useRef(null);
  useEffect(() => {
    if (!isChatLoaded && globalMessages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      console.log("Scrolled to bottom");
    }
  }, [isChatLoaded, globalMessages.length]);
  
  return (
    globalMessages && (
      <div className="flex flex-col justify-center items-center h-screen bg-[var(--dusty-bg)] ">
        <div className="max-w-[1000px] flex flex-col justify-between  border-x border-gray-500 overflow-scroll w-full h-full">
          {isChatLoaded ? (
            <ChatSkeleton />
          ) : (
            <>
              <Navbar />
              <div className="overflow-scroll p-1 md:px-2 pb-[100px] w-full border-t border-gray-500">
                {globalMessages.length === 0 ? (
                  <div className="h-full w-full text-white text-center content-center text-2xl">
                    No chat yet..
                  </div>
                ) : (
                  <div>
                    {globalMessages?.map((message) => (
                      <div
                        className={`text-white  flex flex-col py-2 gap-1 ${
                          message.senderId === authUser?._id
                            ? "items-end"
                            : "items-start"
                        }`}
                        key={message._id}
                      >
                        <div
                          className={`flex  gap-2 ${
                            message.senderId === authUser?._id
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <Link href={`/user/profile/${message.senderId}`}>
                            {" "}
                            <div className=" w-10 h-10 rounded-full overflow-hidden ">
                              <img
                                src={
                                  message.senderId === authUser?._id
                                    ? authUser?.imageUrl ||
                                      "/images/default.png"
                                    : "/images/default.png"
                                }
                                alt="user"
                              />
                            </div>
                          </Link>
                          <div
                            className={`flex flex-col  ${
                              message.senderId === authUser?._id
                                ? "bg-slate-700 rounded-s-xl rounded-t-xl"
                                : "bg-neutral-600  rounded-e-xl rounded-es-xl"
                            } justify-center `}
                          >
                            <div className="px-2 mt-1">
                              {message?.imageUrl !== "" && (
                                <img
                                  src={message.imageUrl}
                                  alt=""
                                  className="h-40 rounded-lg border border-gray-400"
                                />
                              )}
                            </div>
                            <div className="content-center px-2 pt-1  rounded-xl min-w-[100px] max-w-[250px] text-white">
                              {message.senderId !== authUser?._id && (
                                <p className=" text-xs text-amber-400 ">
                                  {message.senderName}
                                </p>
                              )}
                              <p>{message.content}</p>
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
              <MessageInput />
            </>
          )}
        </div>
      </div>
    )
  );
};

export default GlobalChatBox;
