import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  exp: number;
  access: string;
  userId: number;
  isAdmin: boolean;
  isAuth: boolean;
};

type Actions = {
  setAuthState: (access: string, userId: number, isAdmin: boolean, exp: number) => void;
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
      setAuthState: (access: string, userId: number, isAdmin: boolean, exp: number) =>
        set(() => ({
          access,
          userId,
          isAdmin,
          exp,
          isAuth: !!access 
        })),
      logout: () => set(() => ({ access: "", userId: 0, isAdmin: false, isAuth: false })),
    }),
    {
      name: "auth",
    }
  )
);
