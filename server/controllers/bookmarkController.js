import Bookmark from '../models/bookmark.js';
import Contest from '../models/contest.js';

// Add a bookmark
export const addBookmark = async (req, res) => {
  try {
    const { userId, contestId } = req.body;

    if (!userId || !contestId) {
      return res.status(400).json({ success: false, message: "User ID and Contest ID are required" });
    }

    const existingBookmark = await Bookmark.findOne({ userId, contestId });
    if (existingBookmark) {
      return res.status(400).json({ success: false, message: "Bookmark already exists" });
    }

    const newBookmark = new Bookmark({ userId, contestId });
    await newBookmark.save();

    res.status(201).json({ success: true, message: "Bookmark added successfully" });
  } catch (error) {
    console.error("Error adding bookmark:", error.message);
    res.status(500).json({ success: false, message: "Failed to add bookmark" });
  }
};

// Delete a bookmark
export const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBookmark = await Bookmark.findOne({contestId: id});
    if (!deletedBookmark) {
      return res.status(404).json({ success: false, message: "Bookmark not found" });
    }
    await Bookmark.findByIdAndDelete(deletedBookmark._id);
    console.log("deleted bookmark")
    res.status(200).json({ success: true, message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete bookmark" });
  }
};

// Get all bookmarks for a user
export const getBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookmarks = await Bookmark.find({ userId });
    const contestIds = bookmarks.map(bookmark => bookmark.contestId);
    const contests = await Contest.find({ contestId: { $in: contestIds } });

    res.status(200).json({ success: true, contests });
  } catch (error) {
    console.error("Error fetching bookmarks:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch bookmarks" });
  }
};
