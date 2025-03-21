import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { authStore } from "../store/authStore.js";
import ContestCard from "../components/ContestCard.jsx";
import {
  BookOpenIcon,
  GridIcon,
  LayersIcon,
  SearchIcon,
  TagIcon,
  X,
} from "lucide-react";
import { contestStore } from "../store/contestStore.js";
import SkeletonCard from "../components/SkeletonCard.jsx";

const platforms = ["Codeforces", "Codechef", "Leetcode"];
const contestStatus = ["Past", "Upcoming"];
const statusMapping = {
  Past: "FINISHED",
  Upcoming: "UPCOMING",
};

// Animation variants for smoother transitions
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

const HomePage = () => {
  // Initialize state from localStorage or default values
  const [searchInput, setSearchInput] = useState(() => {
    return localStorage.getItem("contestSearchInput") || "";
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem("contestSearchQuery") || "";
  });
  const [debouncedSearching, setDebouncedSearching] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(() => {
    const stored = localStorage.getItem("contestSelectedPlatforms");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedStatuses, setSelectedStatuses] = useState(() => {
    const stored = localStorage.getItem("contestSelectedStatuses");
    return stored ? JSON.parse(stored) : [];
  });
  const [view, setView] = useState(() => {
    return localStorage.getItem("contestView") || "grid";
  });
  const [isFiltering, setIsFiltering] = useState(false);

  const { user } = authStore();
  const { getAllContests, allContests, isLoading, fetchBookmarks } =
    contestStore();

  useEffect(() => {
    getAllContests();

    if (user && user._id) {
      fetchBookmarks();
    }
  }, [user?._id]);

  useEffect(() => {
    localStorage.setItem("contestSearchInput", searchInput);
  }, [searchInput]);

  useEffect(() => {
    localStorage.setItem("contestSearchInput", searchInput);

    // Don't update searchQuery until typing pauses
    if (searchInput.length > 0) {
      setDebouncedSearching(true);

      const debounceTimer = setTimeout(() => {
        setSearchQuery(searchInput);
        localStorage.setItem("contestSearchQuery", searchInput);
        setDebouncedSearching(false);
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      setSearchQuery("");
      localStorage.setItem("contestSearchQuery", "");
      setDebouncedSearching(false);
    }
  }, [searchInput]);

  useEffect(() => {
    setIsFiltering(true);
    localStorage.setItem(
      "contestSelectedPlatforms",
      JSON.stringify(selectedPlatforms)
    );
    setTimeout(() => setIsFiltering(false), 100);
  }, [selectedPlatforms]);

  useEffect(() => {
    setIsFiltering(true);
    localStorage.setItem(
      "contestSelectedStatuses",
      JSON.stringify(selectedStatuses)
    );
    setTimeout(() => setIsFiltering(false), 100);
  }, [selectedStatuses]);

  useEffect(() => {
    localStorage.setItem("contestView", view);
  }, [view]);

  const togglePlatform = (platform) => {
    setIsFiltering(true);
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const toggleStatus = (status) => {
    setIsFiltering(true);
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const clearAllFilters = () => {
    setIsFiltering(true);
    setSearchInput("");
    setSearchQuery("");
    setSelectedPlatforms([]);
    setSelectedStatuses([]);
    localStorage.removeItem("contestSearchInput");
    localStorage.removeItem("contestSearchQuery");
    localStorage.removeItem("contestSelectedPlatforms");
    localStorage.removeItem("contestSelectedStatuses");
    setTimeout(() => setIsFiltering(false), 100);
  };

  const filteredContests = useMemo(() => {
    return allContests.filter((contest) => {
      const title = contest?.title || "";
      const contestId = contest?.contestId || "";
      const contestStatus = contest?.contestStatus || "";
      const site = contest?.site || "";

      const matchesSearch =
        searchQuery === "" ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contestStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform =
        selectedPlatforms.length === 0 || selectedPlatforms.includes(site);

      const selectedBackendStatuses = selectedStatuses.map(
        (status) => statusMapping[status]
      );
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedBackendStatuses.includes(contestStatus);

      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [allContests, searchQuery, selectedPlatforms, selectedStatuses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex mt-10 items-center gap-2 px-4 py-1.5 rounded-full bg-base-300 animate-pulse w-48 h-8 mx-auto mb-6"></div>
            <div className="h-12 bg-base-300 animate-pulse w-3/4 mx-auto mb-6 rounded-full"></div>
            <div className="h-6 bg-base-300 animate-pulse w-1/2 mx-auto mb-8 rounded-full"></div>
          </div>

          <div className="relative max-w-5xl mx-auto mb-12 space-y-6 flex flex-col">
            <div className="h-14 bg-base-300 animate-pulse rounded-xl w-full"></div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="h-10 bg-base-300 animate-pulse rounded-lg w-24"></div>
              <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
              <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
              <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
              <div className="ml-auto h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="h-10 bg-base-300 animate-pulse rounded-lg w-24"></div>
              <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
              <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
            </div>
          </div>

          <div
            className={`grid gap-6 ${
              view === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-3xl mx-auto"
            }`}
          >
            {Array(6)
              .fill()
              .map((_, index) => (
                <SkeletonCard key={index} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex mt-10 items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
             from-blue-500/10 to-purple-500/10 text-sm mb-6"
          >
            <BookOpenIcon className="w-4 h-4" />
            Community Contests Library
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text mb-6"
          >
            Discover & Bookmark Contests
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg mb-8"
          >
            Explore a curated collection of upcoming and past contests.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto mb-12 space-y-6 flex flex-col">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative flex items-center">
              {debouncedSearching ? (
                <div className="absolute left-4 w-5 h-5 animate-spin rounded-full border-2 border-t-transparent border-blue-500" />
              ) : (
                <SearchIcon className="absolute left-4 w-5 h-5" />
              )}
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search contests..."
                className="w-full pl-12 pr-4 py-4
                  rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearchQuery("");
                  }}
                  className="absolute right-4 p-1 rounded-full hover:bg-gray-700/50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-base-200 rounded-lg">
              <TagIcon className="w-4 h-4" />
              <span className="text-sm">Platforms:</span>
            </div>

            {platforms.map((platform) => (
              <motion.button
                key={platform}
                onClick={() => togglePlatform(platform)}
                whileTap={{ scale: 0.95 }}
                className={`
                    group relative px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer
                    ring
                    ${
                      selectedPlatforms.includes(platform)
                        ? "text-accent bg-blue-900 "
                        : " bg-base hover:bg-base-300"
                    }
                  `}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={`/${platform}.png`}
                    alt={platform}
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-sm">{platform}</span>
                </div>
              </motion.button>
            ))}

            {selectedPlatforms.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPlatforms([])}
                className="flex items-center gap-1 px-2 py-1 text-xs hover:text-gray-500 transition-colors cursor-pointer hover:ring-1 hover:rounded-lg"
              >
                <X className="size-3" />
                Clear
              </motion.button>
            )}

            <div className="ml-auto items-center gap-3 hidden md:flex">
              <span className="text-sm text-gray-500">View</span>
              <div className="flex items-center gap-1 p-1 bg-base-300 rounded-lg ring-1 ring-gray-800">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-md transition-all ${
                    view === "grid"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                  }`}
                >
                  <GridIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView("list")}
                  className={`p-2 rounded-md transition-all ${
                    view === "list"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                  }`}
                >
                  <LayersIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-base-200 rounded-lg">
              <TagIcon className="w-4 h-4" />
              <span className="text-sm">Status:</span>
            </div>

            {contestStatus.map((status) => (
              <motion.button
                key={status}
                onClick={() => toggleStatus(status)}
                whileTap={{ scale: 0.95 }}
                className={`
                    group relative px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer
                    ring
                    ${
                      selectedStatuses.includes(status)
                        ? "text-accent bg-blue-900 "
                        : " bg-base hover:bg-base-300"
                    }
                  `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{status}</span>
                </div>
              </motion.button>
            ))}

            {selectedStatuses.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStatuses([])}
                className="flex items-center gap-1 px-2 py-1 text-xs hover:text-gray-500 transition-colors cursor-pointer hover:ring-1 hover:rounded-lg"
              >
                <X className="size-3" />
                Clear
              </motion.button>
            )}
          </div>

          {(searchQuery ||
            selectedPlatforms.length > 0 ||
            selectedStatuses.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center justify-between pt-2"
            >
              <div className="text-sm text-gray-400">
                Found {filteredContests.length} contests
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-base-300 hover:bg-base-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="size-4" />
                Clear all filters
              </motion.button>
            </motion.div>
          )}
        </div>

        <LayoutGroup>
          {filteredContests.length > 0 ? (
            <div
              className={`grid gap-6 
      ${
        view === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 max-w-3xl mx-auto"
      }`}
            >
              <AnimatePresence mode="sync">
                {filteredContests.map((contest) => (
                  <motion.div
                    key={contest.contestId}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      type: "tween",
                      duration: 0.15,
                      ease: "easeOut",
                    }}
                  >
                    <ContestCard contest={contest} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-xl font-medium mb-2">No contests found</div>
              <p className="text-gray-400">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </LayoutGroup>
      </div>
    </div>
  );
};

export default HomePage;
