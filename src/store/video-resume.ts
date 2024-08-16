import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  isChangePageRequested: boolean;
};

type Actions = {
  changePage: (isChangePageRequested: boolean) => void;
};

export const useVideoResumeStore = create(
  persist<State & Actions>(
    (set) => ({
      isChangePageRequested: false,
      changePage: (isChangePageRequested: boolean) => set({ isChangePageRequested }),
    }),
    {
      name: "video-resume",
    }
  )
);
