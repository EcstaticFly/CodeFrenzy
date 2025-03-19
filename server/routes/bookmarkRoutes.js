import express from "express";
import {
  addBookmark,
  deleteBookmark,
  getBookmarks,
} from "../controllers/bookmarkController.js";
import { verifyjwt } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/add", verifyjwt, addBookmark); // Add a new bookmark
router.delete("/delete/:id", verifyjwt, deleteBookmark); // Delete a bookmark by ID
router.get("/:userId", verifyjwt, getBookmarks); // Fetch all bookmarks for a user

export default router;
