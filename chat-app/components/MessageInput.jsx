import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { GrGallery } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import useGlobalChatStore from "../store/useGlobalChatStore";
import { getSocket } from "../lib/socket";
import { Divide } from "lucide-react";
import { CldOgImage } from "next-cloudinary";

const MessageInput = () => {
  const socket = getSocket();

  const router = useRouter();
  const pathname = router.pathname;
  // console.log('path is', pathname);

  const { saveMessage, selectedUser, setMessages } = useChatStore(); //for 1-1 messages
  const { authUser } = useAuthStore();
  const { saveMessageGlobally } = useGlobalChatStore(); //for global messages

  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  function handleUploadClick() {
    fileInputRef.current.click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    if (!file?.type.startsWith("image/")) {
      return;
    }
    setSelectedImage(file);
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim() === "" && !selectedImage) return;
    setSelectedImage(null);
    setText("");
    if (pathname.endsWith("/global")) {
      saveMessageGlobally(selectedImage, text);
      return;
    }
    pathname === "/user/chat";
    saveMessage(selectedImage, text);
  }

  return (
    <div className=" w-full  flex items-center gap-5 p-1  border-t border-zinc-600">
      {selectedImage && (
        <div className=" absolute bottom-16 rounded-xl border bg-white">
          <>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="object-cover h-[150px] rounded-sm z"
            />
            <IoMdClose
              className="absolute text-xl text-white -top-2 -right-2 z-10 bg-black rounded-full p-1 cursor-pointer"
              onClick={() => setSelectedImage(null)}
            />
          </>
        </div>
      )}
      <div className="flex-1 relative ">
        <input
          type="text"
          placeholder="Type message"
          value={text}
          autoComplete="off"
          spellCheck={false}
          className="h-12 border-zinc-400 border rounded-lg w-full p-2 text-white bg-transparent "
          onChange={(e) => setText(e.target.value)}
        />{" "}
        <GrGallery
          className="text-2xl text-white cursor-pointer absolute right-3 top-3"
          onClick={handleUploadClick}
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <button
        disabled={text.trim() === "" && !selectedImage}
        className="cursor-pointer"
        onClick={handleSubmit}
      >
        <IoIosSend
          className="text-3xl cursor-pointer"
          style={{
            color: text.trim() !== "" || selectedImage ? "white" : "gray",
          }}
        />
      </button>
    </div>
  );
};

export default MessageInput;
