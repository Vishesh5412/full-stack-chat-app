import { notFound } from "next/navigation";
import { create } from "zustand";

const useChatStore = create((set, get) => ({
  users: [],
  isChatLoaded: false,
  isUsersLoading: false,
  messages: [],
  selectedUser: null,
  onlineUsers: [], //will act as global state for both  global as well as 1-1
  getMessages: async (userToChatId) => {
    const startTime = Date.now();
    const MIN_LOADING_TIME = 500;
    set({ isChatLoaded: true });
    try {
      const response = await fetch("/api/Message/getMessagesBetweenTwo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userToChatId }),
      });
      const data = await response.json();
      set({ messages: data.messages });
    } catch (err) {
      console.log("Unable to fetch messages", err);
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = MIN_LOADING_TIME - elapsed;

      // if data came too fast, wait to turn off loader
      setTimeout(
        () => {
          set({ isChatLoaded: false });
        },
        remaining > 0 ? remaining : 0
      );
    }
  },
  saveMessage: async (image, message) => {
    const { selectedUser } = get();
    const userToChatId = selectedUser._id;
    const formData = new FormData();
    formData.append("userToChatId", userToChatId);
    formData.append("file", image);
    formData.append("message", message);

    try {
      const response = await fetch("/api/Message/saveSendMessages", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        console.log("Unable to store message");
        return;
      }
    } catch (err) {
      console.log("Unable to store message", err);
    }
  },
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  setMessages: (message) => {
    const currentMessages = get().messages;
    set({ messages: [...currentMessages, message] });
  },
  setOnlineUsers: (users) => {
    set({ onlineUsers: [...users] });
    //set line directly assignes the users array to onlineUsers1
    //also act as global for both global and 1-1
  },
  isUserOnline: (userId) => {
    const { onlineUsers } = get(); //get return the array of onlineUsers
    return onlineUsers.includes(userId);
  },
  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const response = await fetch("/api/global/getUsers");
      const data = await response.json();
      set({ users: data.usersWithoutMe });
    } catch (err) {
      console.log("Unable to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
}));

export default useChatStore;
