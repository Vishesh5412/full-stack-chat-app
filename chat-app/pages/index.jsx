import React, { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";

import { Input } from "../components/ui/input";
import Link from "next/link";
import useAuthStore from "../store/useAuthStore";
import useLoaderStore from "../store/loaderStore";

import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";


import { Amaranth } from "next/font/google";

const amaranth = Amaranth({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { loginUser } = useAuthStore();
  const { showLoader } = useLoaderStore();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  }
  function handleSubmit(e) {
    if (userData.email === "" || userData.password.length < 6) {
      return;
    }
    e.preventDefault();
    showLoader();
    loginUser(userData);
    setUserData({ email: "", password: "" });
  }
  return (
    <div className="min-h-screen w-screen  bg-[#151b23] pt-[70px]">
      <div className="flex  flex-col justify-center  px-6 py-10 lg:px-8 ">
      <div className={`sm:mx-auto sm:w-full sm:max-w-sm text-white text-center ${amaranth.className}`}>
          <p className="text-[35px]/7">Welcome back to</p> <br />
          <p className="text-red-600 font-extrabold text-5xl/7 ">
            Whispr
          </p>
          <h2 className="mt-10 text-center text-2xl/9  tracking-tight text-neutral-400">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-white  "
              >
                Email address
              </label>
              <div className="mt-2 relative">
                <Input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <MdOutlineEmail className="absolute  top-2.5 left-2 text-xl text-gray-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-white "
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <Input
                  type={isPasswordVisible ? "placeholder" : "password"}
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  minLength={6}
                  className="px-2"
                  required
                />
                {isPasswordVisible && userData.password !== "" && (
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-black mr-2 text-lg cursor-pointer text-white"
                  >
                    <FaRegEye />
                  </button>
                )}
                {!isPasswordVisible && userData.password !== "" && (
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-black mr-2 text-lg cursor-pointer text-white"
                  >
                    <FaRegEyeSlash />
                  </button>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleSubmit}
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-white dark:text-gray-400">
            Not registered?
            <Link
              href={"/signup"}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
