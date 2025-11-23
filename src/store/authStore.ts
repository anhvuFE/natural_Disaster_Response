import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types";

type AuthState = {
  token?: string;
  user?: AuthUser;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: undefined, user: undefined }),
    }),
    {
      name: "ndr.auth",
      version: 2,
      migrate: (persistedState: any, version) => {
        if (version < 2 && persistedState?.user?.provinceIds?.length) {
          const provinceIds = persistedState.user.provinceIds.map((id: string) => (id === "demo-province" ? "minh-hoa" : id));
          return { ...persistedState, user: { ...persistedState.user, provinceIds } };
        }
        return persistedState;
      },
    }
  )
);
