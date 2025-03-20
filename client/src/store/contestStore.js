import { create } from "zustand";
import { axiosInstance } from "../configs/axios.js";
import { toast } from "react-toastify";
import { authStore } from "./authStore.js";
import { persist } from "zustand/middleware";


export const contestStore = create(
  persist(
    (set, get) => ({
      allContests: [],
      bookmarks: [],
      isLoading: false,
      isAddingSolution: false,
      lastFetchedContests: null,
      lastFetchedBookmarks: null,

      getAllContests: async (forceRefresh = false) => {
        // Only fetch if we haven't fetched before or if it's been more than 15 minutes
        const now = new Date().getTime();
        const fifteenMinutes = 15 * 60 * 1000;
        
        if (!forceRefresh && 
            get().allContests.length > 0 && 
            get().lastFetchedContests && 
            now - get().lastFetchedContests < fifteenMinutes) {
          return; // Use cached data
        }

        set({ isLoading: true });
        try {
          const response = await axiosInstance.get("/contests/all");
          set({ 
            allContests: response.data.contests,
            lastFetchedContests: now
          });
        } catch (error) {
          console.log(error);
          set({ allContests: [] });
          toast.error("Failed to fetch contests. Please refresh.");
        } finally {
          set({ isLoading: false });
        }
      },

      fetchBookmarks: async (forceRefresh = false) => {
        // Only fetch if we haven't fetched before or if it's been more than 15 minutes
        const now = new Date().getTime();
        const fifteenMinutes = 15 * 60 * 1000;
        
        if (!forceRefresh && 
            get().bookmarks.length > 0 && 
            get().lastFetchedBookmarks && 
            now - get().lastFetchedBookmarks < fifteenMinutes) {
          return;
        }

        try {
          const { user } = authStore.getState();
          const userId = user?._id;
          if (!userId) {
            toast.error("Please login to view bookmarks.");
            return;
          }
          const response = await axiosInstance.get(`/bookmarks/${userId}`);
          set({
            bookmarks: response.data.contests.map((contest) => contest.contestId),
            lastFetchedBookmarks: now
          });
        } catch (e) {
          console.log("Error fetching bookmarks: ", e);
          toast.error("Failed to fetch bookmarks");
        }
      },

      bookmarkToggle: async (contestId) => {
        const { user } = authStore.getState();
        const userId = user?._id;
        if (!userId) {
          toast.error("Please login to bookmark contests.");
          return;
        }
        
        if (get().bookmarks.includes(contestId)) {
          try {
            const response = await axiosInstance.delete(
              `/bookmarks/delete/${contestId}`
            );
            set({ bookmarks: get().bookmarks.filter((id) => id !== contestId) });
          } catch (e) {
            console.log("Error deleting bookmark: ", e);
            toast.error("Error deleting bookmark");
          }
        } else {
          try {
            const response = await axiosInstance.post("/bookmarks/add", {
              userId,
              contestId,
            });
            set({ bookmarks: [...get().bookmarks, contestId] });
          } catch (e) {
            console.log("Error bookmarking contest: ", e);
            toast.error("Error bookmarking contest");
          }
        }
      },

      addSolution: async (userEmail, contestId, youtubeLink, navigate) => {
        set({ isAddingSolution: true });
        try {
          const response = await axiosInstance.post("/contests/addSolution", {
            userEmail,
            contestId,
            youtubeLink,
          });
          toast.success(response.data.message);
          navigate("/");
        } catch (e) {
          console.log("Error adding solution: ", e);
          toast.error(e.response.data.message);
        } finally {
          set({ isAddingSolution: false });
        }
      },

      clearCache: () => {
        set({ 
          lastFetchedContests: null,
          lastFetchedBookmarks: null 
        });
      },
    }),
    {
      name: "contest-storage",
      partialize: (state) => ({

        allContests: state.allContests,
        bookmarks: state.bookmarks,
        lastFetchedContests: state.lastFetchedContests,
        lastFetchedBookmarks: state.lastFetchedBookmarks,
      }),
    }
  )
);