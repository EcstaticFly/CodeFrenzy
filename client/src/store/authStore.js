import { create } from "zustand";
import { axiosInstance } from "../configs/axios.js";
import { toast } from "react-toastify";
import { contestStore } from "./contestStore.js";


const clearFilters = () => {
  localStorage.removeItem("contestSearchInput");
  localStorage.removeItem("contestSearchQuery");
  localStorage.removeItem("contestSelectedPlatforms");
  localStorage.removeItem("contestSelectedStatuses");
  localStorage.removeItem("contestView");
};

export const authStore = create((set, get) => ({
  user: null,
  isLoggingIn: false,
  isLoading: true,
  // updateUser: (updatedUser) => set((state) => ({ user: { ...state.user, ...updatedUser } })),

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ user: response.data });
    } catch (error) {
      console.log(error);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (formData) => {
    set({ isRegistering: true });
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      set({ user: response.data });
      toast.success(response.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      set({ user: response.data });
      toast.success(response.data.message);

      const { fetchBookmarks } = contestStore.getState();
      fetchBookmarks(true);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      toast.success(response.data.message);
      set({ user: null });
      clearFilters();

      const { clearCache } = contestStore.getState();
      clearCache();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  },

  sendOtp: async (formData) => {
    set({ isSendingOtp: true });
    try {
      const response = await axiosInstance.post("/auth/sendOtp", formData);
      toast.success(response.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isSendingOtp: false });
    }
  },

  verifyOtp: async (formData, givenOTP) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/auth/verifyOtp", {
        formData,
        givenOTP,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));