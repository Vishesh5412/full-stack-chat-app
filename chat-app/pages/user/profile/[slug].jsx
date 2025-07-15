import UserModel from "../../../models/UserModel";
import connectToDatabase from "../../../config/mongoose";

import { useRouter } from "next/router";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

import Navbar from "../../../components/Navbar";
import { notFound } from "next/navigation";
import extractDate from "../../../utils/extractDate";
import { useEffect } from "react";
import useLoaderStore from "../../../store/loaderStore";

export async function getServerSideProps(req) {
  await connectToDatabase();
  try {
    const userId = req.params.slug;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return {
        notFound: true,
      };
    } 
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (err) {
    console.log("Something went wrong", err);
    return {
      notFound: true,
    };
  }
}

export default function UserProfilePage({ user }) {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen bg-[var(--dusty-bg)] flex flex-col items-center">
      <Navbar />

      <div className="text-white border border-gray-400 rounded-xl max-w-[600px] w-[calc(100vw-10px)] md:w-full  p-4 my-10 mx-[3px]">
        <p className="text-center text-2xl font-bold my-2">Profile</p>
        <p className="text-center text-xl w-full grow">Public information</p>

        <div className="w-full flex justify-center my-4 ">
          <div className="relative h-32 w-32  rounded-full  ">
            <div className="h-32 w-32 overflow-hidden border border-gray-400 rounded-full">
              <img
                src={`${user.imageUrl || "/images/default.png"}`}
                alt="user"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
        </div>

        <div className="p-0 mx-0 my-3 w-full">
          <div className="flex items-center space-x-1 my-1">
            <FaRegUser className="text-lg" />
            <label>Name</label>
          </div>
          <div className="border p-2 border-zinc-300 rounded-sm w-full text-amber-400">
            {user?.name}
          </div>
        </div>

        <div className="p-0 mx-0 my-3 w-full ">
          <div className="flex items-center space-x-1 my-1">
            <MdOutlineEmail className="text-lg" />
            <label>Email</label>
          </div>
          <div className="border p-2 border-zinc-300 rounded-sm w-full text-amber-400">
            {user?.email}
          </div>
        </div>
        {user.about && (
          <div className="mb-2">
            <span className="block mb-1 font-medium text-white">About</span>
            <div className="text-white border p-2 rounded-sm">{user.about}</div>
          </div>
        )}
        <div className="p-2">
          <p className="text-xl mb-2">Account Information</p>
          <div className=" w-full flex flex-col gap-1 text-lg">
            <div className="flex justify-between">
              <p>Member Since </p>
              <p className="text-amber-400">{extractDate(user?.createdAt)}</p>
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
}
