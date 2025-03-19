import { useState } from "react";
import { contestStore } from "../store/contestStore.js";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { convertToIST } from "../configs/utils.js";
import { authStore } from "../store/authStore.js";

const AddSolution = () => {
  const { user } = authStore();
  const { addSolution, isAddingSolution } = contestStore();
  const [youtubeLink, setYoutubeLink] = useState("");
  const location = useLocation();
  const contest = location.state?.contest;
  const navigate = useNavigate();

  const isValidYouTubeLink = (link) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(link);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!youtubeLink.trim()) {
      toast.error("YouTube link cannot be empty!");
      return;
    }
    if (!isValidYouTubeLink(youtubeLink)) {
      toast.error("Please enter a valid YouTube link.");
      return;
    }
    const contestId = contest?.contestId;
    const userEmail = user?.email;
    addSolution(userEmail, contestId, youtubeLink, navigate);
  };
  return (
    <div className="min-h-screen grid grid-cols-1">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 ">
                <img
                  src="/codeFrenzy.png"
                  className="size-12 text-primary"
                  alt="CodeFrenzy logo"
                />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                {" "}
                Add YouTube Solution Link
              </h1>
              <p className="text-base-content/60">
                Attach a YouTube discussion link to the contest.{" "}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-center mb-8">
            <p>ContestId: {contest?.contestId || "NA"}</p>
            <p>Title: {contest?.title || "NA"}</p>
            <p>Platform: {contest?.site || "NA"}</p>
            <p>url: {contest?.url || "NA"}</p>
            <p>
              Start Time:{" "}
              {contest?.startTime ? convertToIST(contest?.startTime) : "NA"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-7">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Youtube Link"
                value={youtubeLink}
                onChange={(event) => {
                  setYoutubeLink(event.target.value);
                }}
              />
            </label>
            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={isAddingSolution}
            >
              {isAddingSolution ? (
                <>
                  <Loader className="size-6 animate-spin" />
                  <span className="font-semibold">Adding...</span>
                </>
              ) : (
                "Add"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSolution;
