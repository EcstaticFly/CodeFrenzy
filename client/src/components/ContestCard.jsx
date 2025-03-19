import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Clock,
  Code,
  Link,
  Timer,
  Calendar,
  PlayCircleIcon,
} from "lucide-react";
import { authStore } from "../store/authStore";
import { convertToIST } from "../configs/utils";
import BookmarkButton from "./BookmarkButton";
import { useNavigate } from "react-router-dom";

const adminEmails = import.meta.env.VITE_ADMIN_EMAILS.split(",");

export default function ContestCard({ contest }) {
  const { user } = authStore();
  const [timeRemaining, setTimeRemaining] = useState("");
  const navigate = useNavigate();

  const calculateTimeRemaining = () => {
    const now = new Date();
    const startTime = new Date(contest.startTime);

    if (now >= startTime || contest.contestStatus === "FINISHED") {
      return "";
    }

    const diff = startTime - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  useEffect(() => {
    if (contest.contestStatus !== "UPCOMING") {
      return;
    }

    const initialTimeRemaining = calculateTimeRemaining();
    setTimeRemaining(initialTimeRemaining);

    const timer = setInterval(() => {
      const remainingTime = calculateTimeRemaining();
      setTimeRemaining(remainingTime);

      // Clear interval if contest has started
      if (remainingTime === "") {
        clearInterval(timer);
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [contest.startTime, contest.contestStatus]);

  const handleClick = () => {
    if (contest?.youtubeLink) {
      window.open(contest?.youtubeLink, "_blank");
    } else if (
      contest.contestStatus === "FINISHED" &&
      adminEmails.includes(user?.email)
    ) {
      navigate("/addSolution", { state: { contest } });
    }
  };

  return (
    <motion.div
      layout
      className="group relative"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full block">
        <div
          className="relative h-full  rounded-xl 
        border border-[#313244]/50 hover:border-[#313244] 
        transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 
                group-hover:opacity-30 transition-all duration-500"
                    area-hidden="true"
                  />
                  <div
                    className="relative p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20
                 group-hover:to-purple-500/20 transition-all duration-500"
                  >
                    <img
                      src={`/${contest.site}.png`}
                      alt={`${contest.site} logo`}
                      className="w-6 h-6 object-contain relative z-10"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-lg text-lg font-medium">
                    {contest.site}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="size-3" />
                    Duration: {contest.duration} hrs
                  </div>
                </div>
              </div>
              <div
                className="absolute top-6 right-6 z-10 flex gap-2 items-center border rounded-lg cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <BookmarkButton contestId={contest.contestId} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 line-clamp-1 transition-colors">
                  {contest.title}
                </h2>
                <div className="flex flex-col items-start gap-3 text-sm ">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md">
                      <Code className="size-3" />
                    </div>
                    {contest?.contestStatus && (
                      <span className="truncate max-w-[150px] font-extrabold">
                        {contest.contestStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex w-full justify-between">
                      <div className="flex gap-2">
                        <div className="p-1 rounded-md">
                          <Calendar className="size-3" />
                        </div>
                        <span className="max-w-[450px]">
                          {convertToIST(contest.startTime)}
                        </span>
                      </div>
                      {timeRemaining && (
                        <div className="flex items-center gap-2 ml-8 mr-0 text-blue-400">
                          <Timer className="size-3" />
                          <span>{timeRemaining}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="relative group/code cursor-pointer"
                onClick={() => window.open(contest.url, "_blank")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 rounded-lg opacity-0 group-hover/code:opacity-100 transition-all" />
                <pre className="relative ring-1 flex gap-4 items-center justify-start rounded-lg p-4 overflow-hidden text-sm font-mono text-ellipsis whitespace-nowrap">
                  <Link className="size-5" />
                  <p className="text-blue-500 font-semibold truncate">
                    {contest.url}
                  </p>
                </pre>
              </div>

              <div
                className="relative group/code cursor-pointer"
                onClick={handleClick}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 rounded-lg opacity-0 group-hover/code:opacity-100 transition-all" />
                <pre className="relative ring-1 flex gap-4 items-center justify-start rounded-lg p-4 overflow-hidden text-sm font-mono text-ellipsis whitespace-nowrap">
                  <PlayCircleIcon className="size-5" />
                  {contest.youtubeLink ? (
                    <p className="text-blue-500 font-semibold truncate">
                      Watch Post-Contest Discussion
                    </p>
                  ) : contest.contestStatus === "FINISHED" ? (
                    adminEmails.includes(user?.email) ? (
                      <div
                        className="w-full h-full"
                        // onClick={() => navigate("/addSolution", { state: { contest } })}
                      >
                        Add Solution
                      </div>
                    ) : (
                      <p className="text-gray-400 truncate">
                        No discussion link available yet.
                      </p>
                    )
                  ) : (
                    <p className="text-gray-400 truncate">
                      Video will be available soon!
                    </p>
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
