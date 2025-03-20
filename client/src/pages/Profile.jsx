import React, { useEffect, useState } from "react";
import { authStore } from "../store/authStore.js";
import ContestCard from "../components/ContestCard.jsx";
import { useNavigate } from "react-router-dom";
import { contestStore } from "../store/contestStore.js";
import ProfilePageSkeleton from "../components/ProfilePageSkeleton.jsx"

const generateRandomColor = (name) => {
  if (!name || typeof name !== "string" || name.length === 0) {
    return "#6366f1";
  }

  const charCode = name.charCodeAt(0);
  const hue = (charCode * 137.5) % 360;
  return `hsl(${hue}, 60%, 65%)`;
};

const ProfilePage = () => {
  const { user } = authStore();
  const { bookmarks, allContests, getAllContests, fetchBookmarks, isLoading } = contestStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchBookmarks();
    getAllContests();
  }, []);

  const firstLetter = (user && user.fullName && user.fullName.charAt(0).toUpperCase()) || "?";
  const avatarColor = generateRandomColor(user?.fullName);

  const bookMarkedContests = allContests.filter((contest) =>
    bookmarks.includes(contest.contestId)
  );

  const leetcodeBookmarks = bookMarkedContests.filter(
    (contest) => contest.site.toLowerCase() === "leetcode"
  );
  const codeforcesBookmarks = bookMarkedContests.filter(
    (contest) => contest.site.toLowerCase() === "codeforces"
  );
  const codechefBookmarks = bookMarkedContests.filter(
    (contest) => contest.site.toLowerCase() === "codechef"
  );
  const otherBookmarks = bookMarkedContests.filter(
    (contest) => 
      contest.site.toLowerCase() !== "leetcode" && 
      contest.site.toLowerCase() !== "codeforces" && 
      contest.site.toLowerCase() !== "codechef"
  );

  const getActiveBookmarks = () => {
    switch (activeTab) {
      case "leetcode":
        return leetcodeBookmarks;
      case "codeforces":
        return codeforcesBookmarks;
      case "codechef":
        return codechefBookmarks;
      case "others":
        return otherBookmarks;
      default:
        return bookMarkedContests;
    }
  };

  const activeBookmarks = getActiveBookmarks();

  if(isLoading){
    return (
      <ProfilePageSkeleton />
    );
  }

  return (
    <div className="max-w-4xl min-h-screen mx-auto p-6 mt-16">
      <div className="bg-base-200 rounded-lg shadow-md p-6 mb-8 flex items-center">
        <div
          className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center text-6xl font-bold mr-6"
          style={{ backgroundColor: avatarColor }}
        >
          {firstLetter}
        </div>

        <div className="flex-grow">
          <h1 className="text-2xl font-bold">
            {user?.fullName || "Unknown User"}
          </h1>
          <p className="">{user?.email || "No email provided"}</p>
          <p className="mt-2">
            <span className="font-semibold">Bookmarks:</span>{" "}
            {bookmarks?.length || 0}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 ring-1 rounded-2xl text-center p-2">
          Bookmarks
        </h2>

        {bookMarkedContests && bookMarkedContests.length > 0 ? (
          <>
            <div className="flex justify-center mb-6 overflow-x-auto">
              <div className="tabs tabs-boxed">
                <button
                  className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  All ({bookMarkedContests.length})
                </button>
                <button
                  className={`tab ${activeTab === "leetcode" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("leetcode")}
                >
                  LeetCode ({leetcodeBookmarks.length})
                </button>
                <button
                  className={`tab ${activeTab === "codeforces" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("codeforces")}
                >
                  CodeForces ({codeforcesBookmarks.length})
                </button>
                <button
                  className={`tab ${activeTab === "codechef" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("codechef")}
                >
                  CodeChef ({codechefBookmarks.length})
                </button>
                {otherBookmarks.length > 0 && (
                  <button
                    className={`tab ${activeTab === "others" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("others")}
                  >
                    Others ({otherBookmarks.length})
                  </button>
                )}
              </div>
            </div>

            {activeBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBookmarks.map((contest, index) => (
                  <ContestCard key={index} contest={contest} />
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <p>No bookmarks found for this platform.</p>
              </div>
            )}
          </>
        ) : (
          <div
            className="rounded-lg p-8 text-center"
            onClick={() => navigate("/")}
          >
            <p className="">No bookmarks found</p>
            <button
              className="mt-4 bg-blue-500 px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
            >
              Add your first bookmark
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;