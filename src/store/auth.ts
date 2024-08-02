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
  setAuthState: (access: string, user_id: number, is_admin: boolean, exp: number) => void;
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
      setAuthState: (access: string, user_id: number, is_admin: boolean, exp: number) =>
        set(() => ({
          access,
          user_id,
          is_admin,
          exp,
          isAuth: !!access 
        })),
      logout: () => set(() => ({ access: "", user_id: 0, isAdmin: false, isAuth: false })),
    }),
    {
      name: "auth",
    }
  )
);
