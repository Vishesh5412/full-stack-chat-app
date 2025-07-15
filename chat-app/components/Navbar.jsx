import React from "react";
import Link from "next/link";
// import toast, { Toaster } from "react-hot-toast";

import { IoSettings } from "react-icons/io5";
import { IoMdChatbubbles } from "react-icons/io";
import { PiChatTextFill } from "react-icons/pi";

import { FaRegUserCircle } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa6";

import { LuLogOut } from "react-icons/lu";

import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import useGlobalChatStore from "../store/useGlobalChatStore";
import useLoaderStore from "../store/loaderStore";

const Navbar = () => {
  const { logoutUser } = useAuthStore();
  const { getMessages } = useGlobalChatStore();
  const { showLoader } = useLoaderStore();

  function handleLogout() {
    logoutUser();
    showLoader();
  }

  return (
    <>
      {/* <div className="w-full flex h-[60px]  bg-[var(--dusty-bg)]  justify-between items-center "> */}
      <div className="w-full flex  bg-[var(--dusty-bg)]  justify-between items-center py-3">
      <div className="pl-[25px] text-3xl">
          <PiChatTextFill className="text-white" />
          <label></label>
        </div>
        <div className="flex  gap-0 md:gap-3 md:mr-1">
          <>
            <Link href={"/user/global"}>
              <button className="flex items-center cursor-pointer w-auto text-white px-2 py-1 rounded-2xl cursor-pointer">
                <FaGlobe className="text-grey-800 text-2xl mr-2" />
              </button>
            </Link>
            <Link href={"/user/profile"}>
              <button className=" flex items-center cursor-pointer w-auto text-white px-2 py-1 rounded-2xl cursor-pointer">
                <FaRegUserCircle className="text-grey-800 text-2xl mr-2" />
              </button>
            </Link>
            <button
              className=" flex items-center cursor-pointer w-auto text-white px-2 py-1 rounded-2xl cursor-pointer "
              onClick={handleLogout}
            >
              <LuLogOut className="text-grey-800 text-2xl mr-2" />
            </button>
          </>
        </div>
      </div>
    </>
  );
};

export default Navbar;
