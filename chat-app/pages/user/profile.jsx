import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { CldOgImage } from "next-cloudinary";
import { FaCamera } from "react-icons/fa";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";

import useAuthStore from "../../store/useAuthStore";

import extractDate from "../../utils/extractDate";

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

const ProfilePage = ({ authUser }) => {
  const { setAuthUser, updateUser } = useAuthStore();
  const [about, setAbout] = useState(authUser?.about);
  const [file, setFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setAuthUser(authUser);
  }, [authUser]);

  const fileInputRef = useRef(null);

  function handleUploadClick() {
    fileInputRef.current.click();
  }
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const imageFile = e.target.files[0];
    if (!imageFile.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return;
    }
    updateUser(imageFile, about);
  };

  return (
    <div
      className="w-screen min-h-screen  flex flex-col items-center bg-[var(--dusty-bg)]"
      data-theme="cyberpunk"
    >
      <Navbar />
      <div className="text-white border border-gray-400 rounded-xl max-w-[600px] w-[calc(100vw-10px)] md:w-full  p-4 my-10 mx-[3px]">
        <p className="text-center text-2xl font-bold my-2">Profile</p>
        <p className="text-center text-xl w-full grow">
          Your Public information
        </p>

        <div className="w-full flex justify-center my-4 ">
          <div className="relative h-32 w-32  rounded-full  ">
            <div className="h-32 w-32 overflow-hidden border border-gray-400 rounded-full">
              <img
                src={authUser?.imageUrl || "/images/default.png"}
                alt="user"
                className="w-full aspect-square object-cover"
              />
            </div>
            <button className="absolute  bottom-2 right-[-10px]  rounded-full  p-1.5 bg-yellow-300">
              <FaCamera
                className="text-xl text-black cursor-pointer"
                onClick={handleUploadClick}
              />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="p-0 mx-0 my-3 w-full">
          <div className="flex items-center space-x-1 my-1">
            <FaRegUser className="text-lg" />
            <label>Name</label>
          </div>
          <div className="border p-2 border-zinc-300 rounded-sm w-full text-amber-400">
            {authUser?.name}
          </div>
        </div>

        <div className="p-0 mx-0 my-3 w-full ">
          <div className="flex items-center space-x-1 my-1">
            <MdOutlineEmail className="text-lg" />
            <label>Email</label>
          </div>
          <div className="border p-2 border-zinc-300 rounded-sm w-full text-amber-400">
            {authUser?.email}
          </div>
        </div>

        <div className="mb-2">
          <label htmlFor="message" className="block mb-1 font-medium text-white">
            About
          </label>
          <textarea
            name="about"
            value={about}
            id="message"
            disabled={isDisabled}
            rows="4"
            spellCheck={false}
            className="block p-2.5 w-full text-lg text-white rounded-lg border border-gray-300  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white bg-transparent"
            placeholder="Write your thoughts here... "
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>

        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={() => setIsDisabled(false)}
            className="text-black bg-red-600 text-white font-medium rounded text-sm px-2 py-1 text-center me-2 mb-2 cursor-pointer"
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDisabled(true), updateUser(file, about);
            }}
            className="text-black bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200  focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded text-sm px-2 py-1 text-center me-2 mb-2 cursor-pointer"
          >
            Save
          </button>
        </div>
        <div className="p-2">
          <p className="text-xl mb-2">Account Information</p>
          <div className=" w-full flex flex-col gap-1 text-lg">
            <div className="flex justify-between">
              <p>Member Since </p>
              <p className="text-amber-400">
                {extractDate(authUser?.createdAt)}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Account Status </p>
              <p className="text-green-500 font-bold">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
