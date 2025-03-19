import { create } from "zustand";
import { axiosInstance } from "../configs/axios.js";
import { toast } from "react-toastify";
import { authStore } from "./authStore.js";

const BASE_URL = "http://localhost:5000";

export const contestStore = create((set, get) => ({
  allContests: [],
  bookmarks: [],
  isLoading: false,

  getAllContests: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/contests/all");
      set({ allContests: response.data.contests });
    } catch (error) {
      console.log(error);
      set({ allContests: [] });
      toast.error("Failed to fetch contests. Please refresh.");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBookmarks: async () => {
    try {
      const { user } = authStore.getState();
      const userId = user?._id;
      if (!userId){
        toast.error("Please login to view bookmarks.");
        return;
      }
      const response = await axiosInstance.get(`/bookmarks/${userId}`);
      set({ bookmarks: response.data.contests.map(contest => contest.contestId)})
    } catch (e) {
      console.log("Error fetching bookmarks: ", e);
      toast.error("Failed to fetch bookmarks");
    }
  },

  bookmarkToggle: async(contestId)=>{
    const { user } = authStore.getState();
    const userId = user?._id;
    if (!userId){
      toast.error("Please login to bookmark contests.");
    }
    if(get().bookmarks.includes(contestId)){
      try {
        const response = await axiosInstance.delete(`/bookmarks/delete/${contestId}`);
        set({ bookmarks: get().bookmarks.filter(id => id !== contestId) });
      }catch(e){
        console.log("Error deleting bookmark: ", e);
        toast.error("Error deleting bookmark");
      }
    }else{
      try {
        const response = await axiosInstance.post("/bookmarks/add", {userId, contestId});
        set({ bookmarks: [...get().bookmarks, contestId] });
      }catch(e){
        console.log("Error bookmarking contest: ", e);
        toast.error("Error bookmarking contest");
      }
    }
  }
}));
