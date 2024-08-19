import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  isChangePageRequested: boolean;
  history_id: string
  resume: number
};

type Actions = {
  changePage: (isChangePageRequested: boolean) => void;
  setResume: (resume: number) => void;
  setHistoryId: (history_id: string) => void
};

export const useVideoResumeStore = create(
  persist<State & Actions>(
    (set) => ({
      isChangePageRequested: false,
      history_id: "",
      resume: 0,
      changePage: (isChangePageRequested: boolean) => set({ isChangePageRequested }),
      setResume: (resume: number) => set({ resume }),
      setHistoryId: (history_id: string) => set({ history_id })
    }),
    {
      name: "video-resume",
    }
  )
);
