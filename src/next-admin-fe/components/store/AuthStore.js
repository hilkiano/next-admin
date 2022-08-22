import create from "zustand";

export const useAuthStore = create((set) => ({
  user: [],
  setUser: (newUser) => set({ user: newUser }),
  isLoading: true,
  setIsLoading: (status) => set({ isLoading: false }),
}));
