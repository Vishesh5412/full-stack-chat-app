import React from "react";
import Link from "next/link";

import { Amaranth } from "next/font/google";

const amaranth = Amaranth({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const NoChatSelected = () => {
  return (
    <>
      {/* <!-- Hero --> */}
      <div className="bg-[var(--dusty-bg)] via-transparent h-full flex items-center overflow-scroll">
        <div className={` max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8 ${amaranth.className} `}>
        {/* <!-- Title --> */}
          <div className="max-w-3xl text-center mx-auto p-4">
            <h1 className='block font-medium text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl '>
              Welcome to Whispr
            </h1>
          </div>
          {/* <!-- End Title --> */}

          <div className="max-w-3xl text-center mx-auto">
            <p className="text-lg text-white/70">
              Choose among user from left bar to start chatting
            </p>
          </div>

          {/* <!-- Buttons --> */}
          <div className="text-center">
            <Link
              className="text-xl inline-flex justify-center items-center gap-x-3 text-center bg-linear-to-tl from-blue-600 to-violet-600 shadow-lg shadow-transparent hover:shadow-blue-700/50 border border-gray-600 text-white text-sm font-medium rounded-full focus:outline-hidden focus:shadow-blue-700/50 py-3 px-6 "
              href={'/user/global'}
            >
              Global Chat
            </Link>
          </div>
          {/* <!-- End Buttons --> */}
        </div>
      </div>
      {/* <!-- End Hero --> */}
    </>
  );
};

export default NoChatSelected;
