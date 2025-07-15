import React, { useEffect, useState, useMemo } from "react";
import { Users } from "lucide-react";
import { useRouter } from "next/router";

import { IoIosContacts } from "react-icons/io";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import SidebarSkeleton from "./Skeleton/SideBarSkeleton";
import { CldOgImage } from "next-cloudinary";

const Sidebar = () => {
  const {
    isUsersLoading,
    users,
    selectedUser,
    setSelectedUser,
    getMessages,
    onlineUsers,
    isUserOnline,
    getUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const router = useRouter();

  function handleClick(user) {
    setSelectedUser(user);
    getMessages(user._id);
  }

  useEffect(() => {
    getUsers();
  }, []);
  const filteredUsers = useMemo(
    () =>
      showOnlineOnly ? users.filter((user) => isUserOnline(user._id)) : users,
    [showOnlineOnly, users]
  );
  //simply writing the above line without useMemo => reassignment will takes place on every render

  return isUsersLoading ? (
    <SidebarSkeleton />
  ) : (
    <div className="  px-2 py-3 bg-[var(--dusty-bg)] h-full overflow-hidden text-white">
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 " />
        <span className="font-medium">Contacts</span>
      </div>

      <div className="mt-3 items-center gap-2 mb-3 flex">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-full border-gray-400 border-2 appearance-none checked:bg-blue-500 checked:border-transparent cursor-pointer"
            onChange={() => setShowOnlineOnly(!showOnlineOnly)}
          />
        </label>
        <span className="text-lg text-white ">Show online only</span>
      </div>

      <div className="overflow-y-scroll  overflow-x-hidden h-full">
        {filteredUsers &&
          filteredUsers.map((user) => (
            <div
              className={`text-white   flex items-center space-x-4  py-1 px-[5px] my-2 cursor-pointer hover:bg-gray-800 w-auto rounded ${
                selectedUser?._id === user._id ? "bg-gray-700" : ""
              }`}
              key={user._id}
              onClick={() => handleClick(user)}
            >
              <div className="h-12 w-12  rounded-full overflow-hidden object-scale-down ">
                <img src={`${user.imageUrl || "/images/default.png"}`} alt="" />
              </div>
              <div className=" flex flex-col justify-center">
                <p className="text-xl text-neutral-50">{user.name}</p>
                <p
                  className={`text-gray-400  ${
                    isUserOnline(user._id)
                      ? "text-green-500 font-bold"
                      : "text-gray-500 "
                  }`}
                >
                  {isUserOnline(user._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
