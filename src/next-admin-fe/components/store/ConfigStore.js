import create from "zustand";

export const useConfigStore = create((set) => ({
  config: [],
  setConfig: (newConfig) => set({ config: newConfig }),
  isLoading: true,
  setIsLoading: (status) => set({ isLoading: false }),
}));
