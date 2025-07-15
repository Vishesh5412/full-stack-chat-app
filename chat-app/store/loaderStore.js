import { create } from "zustand";

const useLoaderStore = create((set, get) => ({
  isLoading: false,
  showLoader: () => {
    set({ isLoading: true });
  },
  hideLoader: () => {
    set({ isLoading: false });
  },
}));
export default useLoaderStore;
