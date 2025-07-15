import React from "react";
import { Toaster } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        success: {
          style: {
            background: "#22c55e33", // green-500 with ~20% opacity
            color: "#22c55e",
            border: "3px solid #22c55e",
            padding: "10px",
          },
        },
        error: {
          style: {
            background: "rgba(239, 68, 68, 0.2)", // translucent red
            color: "#ef4444", // Tailwind red-500 text
            border: "3px solid #ef4444", // red border
            padding: "10px",
            borderRadius: "8px",
          },
        },
      }}
    />
  );
};

export default Toast;
