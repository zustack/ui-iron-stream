import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  os: string;
};

type Actions = {
  setOs: (os: string) => void;
};

export const useOsStore = create(
  persist<State & Actions>(
    (set) => ({
      os: "",
      setOs: (os: string) =>
        set(() => ({
          os
        })),
    }),
    {
      name: "os",
    }
  )
);
