import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import useLoaderStore from "../store/loaderStore";
import { getSocket } from "../lib/socket";

import Link from "next/link";
const ChatHeader = () => {
  const socket = getSocket();

  const { setSelectedUser, selectedUser, isUserOnline } =
    useChatStore();
  const { showLoader } = useLoaderStore();
  return (
    selectedUser && (
      <div className="w-full  flex justify-between text-white py-[5px] px-2 border-b border-b-gray-500">
        <Link
          href={`/user/profile/${selectedUser?._id}`}
          className="block w-full"
        >
          <div className="flex items-center space-x-4 flex-1 ">
            <div className="md:h-12 md:w-12 h-10 w-10 rounded-full overflow-hidden">
              <img
                src={`${selectedUser?.imageUrl || "/images/default.png"}`}
                alt=""
              />
            </div>

            <div className="text-white">
              <p className="text-[#FFD700] text-lg font-medium">
                {selectedUser?.name}
              </p>
              <p
                className={`text-sm ${
                  isUserOnline(selectedUser._id)
                    ? "text-green-500 font-bold"
                    : "text-gray-500"
                } `}
              >
                {isUserOnline(selectedUser?._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center  flex-none">
          <IoMdClose
            className="text-3xl cursor-pointer"
            onClick={() => setSelectedUser(null)}
          />
        </div>
      </div>
    )
  );
};

export default ChatHeader;
