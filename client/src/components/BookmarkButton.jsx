import { Bookmark } from "lucide-react";
import React from "react";
import { contestStore } from "../store/contestStore";

const BookmarkButton = ({ contestId }) => {
  const { bookmarkToggle, bookmarks } = contestStore();

  return (
    <button
      className={`group flex cursor-pointer items-center gap-1.5 p-1 rounded-lg 
  transition-all duration-200 ${
    bookmarks.includes(contestId)
      ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
  }`}
      onClick={() => bookmarkToggle(contestId)}
    >
      <Bookmark
        className={`size-6 ${
          bookmarks.includes(contestId)
            ? "fill-yellow-500"
            : "fill-none hover:fill-gray-500"
        }`}
      />
    </button>
  );
};

export default BookmarkButton;
