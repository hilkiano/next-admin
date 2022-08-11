import create from "zustand";

export const useAuthStore = create((set) => ({
  user: [],
  setUser: (newUser) => set({ user: newUser }),
}));
