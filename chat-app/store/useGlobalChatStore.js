import { create } from "zustand";

const useChatStore = create((set, get) => ({
  isChatLoaded: false,
  globalMessages: [],
  getMessages: async () => {
    const startTime = Date.now();
    const MIN_LOADING_TIME = 500;
    set({ isChatLoaded: true });
    try {
      const response = await fetch("/api/global/getGlobalMessages");
      const data = await response.json();
      set({ globalMessages: data.messages });
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
  saveMessageGlobally: async (image, message) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("message", message);

    try {
      const response = await fetch("/api/global/saveGlobalMessages", {
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
  setMessagesGlobally: (message) => {
    const currentMessages = get().globalMessages;
    set({ globalMessages: [...currentMessages, message] });
  },
}));

export default useChatStore;
