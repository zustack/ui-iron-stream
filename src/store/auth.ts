import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  exp: number;
  access: string;
  userId: number;
  isAdmin: boolean;
  isAuth: boolean;
  fullName: string;
};

type Actions = {
  setAuthState: (access: string, userId: number, isAdmin: boolean, exp: number, fullName: string) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<State & Actions>(
    (set) => ({
      access: "",
      userId: 0,
      isAdmin: false,
      exp: 0,
      isAuth: false,
      fullName: "",
      setAuthState: (access: string, userId: number, isAdmin: boolean, exp: number, fullName: string) =>
        set(() => ({
          access,
          userId,
          isAdmin,
          exp,
          isAuth: true,
          fullName
        })),
      logout: () => set(() => ({ access: "", userId: 0, isAdmin: false, isAuth: false, fullName: ""})),
    }),
    {
      name: "auth",
    }
  )
);
