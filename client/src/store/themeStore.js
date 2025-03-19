import { create } from "zustand";

export const themeStore = create((set) => ({
  theme: localStorage.getItem("CodeFrenzy-theme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("CodeFrenzy-theme", theme);
    set({ theme });
  },
}));
