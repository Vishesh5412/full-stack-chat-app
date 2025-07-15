import { create } from "zustand";
import Router from "next/router";
import toast, { Toaster } from "react-hot-toast";
import useLoaderStore from "./loaderStore";

const useAuthStore = create((set, get) => ({
  authUser: null,
  setAuthUser: (user) => {
    set({ authUser: user });
  },
  signUpUser: async (userData) => {
    const { hideLoader } = useLoaderStore.getState();
    try {
      const response = await fetch("/api/User/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) {
        hideLoader();
        return toast.error("Invalid credentials");
      }
      const data = await response.json();
      set({ authUser: data.userObject });
      Router.push("/user/chat").then(() => hideLoader());
    } catch (err) {
      hideLoader();
      console.log("Authentication failed", err);
      return toast.error("Something went wrong");
    }
  },

  loginUser: async (userData) => {
    const { hideLoader } = useLoaderStore.getState();
    try {
      const response = await fetch("/api/User/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) {
        hideLoader();
        console.log("failed");
        return toast.error("Authentication failed");
      }
      const data = await response.json();
      set({ authUser: data.userObject });
      Router.push("/user/chat").then(() => hideLoader());
    } catch (err) {
      hideLoader();
      console.log("Authentication failed", err);
      return toast.error("Something went wrong");
    }
  },

  logoutUser: async () => {
    const { hideLoader } = useLoaderStore.getState();
    await fetch("/api/User/logoutUser");
    hideLoader();
    toast.success("User logout successfully");
    Router.push("/").then(set({ authUser: null }));
  },
  updateUser: async (file, about) => {
    const { showLoader, hideLoader } = useLoaderStore.getState();
    showLoader();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("about", about);
    try {
      const response = await fetch("/api/User/updateUser", {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        console.log("failed");
        Router.push("/");
        hideLoader();
        return toast.error("Authentication failed");
      }
      const data = await response.json();
      set({ authUser: data.updatedUser });
      hideLoader();
      return toast.success("User profile updated");
    } catch (err) {
      hideLoader();
      console.log("Error uploading image", err);
      return toast.error("Something went wrong");
    }
  },
}));
export default useAuthStore;
