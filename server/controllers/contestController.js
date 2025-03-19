import axios from "axios";
import express from "express";
import User from "../models/user.js";
import dotenv from "dotenv";
import Contest from "../models/contest.js";
dotenv.config();

const fetchCodechefContests = async () => {
  let codechefContests = [];
  const codechefResponse = await axios
    .get(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      let data1 = response.data.future_contests;
      for (let i = 0; i < data1.length; i++) {
        let contest = {};
        contest.site = "Codechef";
        contest.contestId = `cc_${data1[i].contest_code}`;
        contest.title = data1[i].contest_name;
        contest.startTime = new Date(data1[i].contest_start_date);
        contest.contestStatus = "UPCOMING";
        contest.duration = data1[i].contest_duration / 60;
        contest.url = "https://codechef.com/" + data1[i].contest_code;
        codechefContests.push(contest);
      }
      let data2 = response.data.past_contests;
      for (let i = 0; i < data2.length; i++) {
        let contest = {};
        contest.site = "Codechef";
        contest.contestId = `cc_${data2[i].contest_code}`;
        contest.title = data2[i].contest_name;
        contest.startTime = new Date(data2[i].contest_start_date);
        contest.contestStatus = "FINISHED";
        contest.duration = data2[i].contest_duration / 60;
        contest.url = "https://codechef.com/" + data2[i].contest_code;
        codechefContests.push(contest);
      }
    });
  return codechefContests;
};

const fetchCodeforcesContests = async () => {
  let codeforcesContests = [];
  const codeforcesResponse = await axios
    .get("https://codeforces.com/api/contest.list", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      let data = response.data.result;
      for (let i = 0; i < 200; i++) {
        //only fetching total of 80contests(past+future)
        let contest = {};
        contest.site = "Codeforces";
        contest.contestId = `cf_${data[i].id}`;
        contest.title = data[i].name;
        contest.startTime = new Date(data[i].startTimeSeconds * 1000);
        if (data[i].phase === "BEFORE") {
          contest.contestStatus = "UPCOMING";
        } else {
          contest.contestStatus = "FINISHED";
        }
        contest.duration = data[i].durationSeconds / 3600;
        contest.url = "https://codeforces.com/contests/" + data[i].id;
        codeforcesContests.push(contest);
      }
    });

  return codeforcesContests;
};

const fetchLeetcodeContests = async () => {
  let leetcodeContests = [];
  const leetcodeResponse = await axios
    .post("https://leetcode.com/graphql", {
      headers: {
        "Content-Type": "application/json",
      },
      query: `{
            allContests{
              title
              startTime
              duration
              titleSlug
            }
          }`,
    })
    .then((response) => {
      let data = response.data.data.allContests;
      for (let i = 0; i < 100; i++) {
        let contest = {};
        contest.site = "Leetcode";
        contest.contestId = `lc_${data[i].titleSlug}`;
        contest.title = data[i].title;
        contest.startTime = new Date(data[i].startTime * 1000);
        i <= 1
          ? (contest.contestStatus = "UPCOMING")
          : (contest.contestStatus = "FINISHED");
        contest.duration = data[i].duration / 3600;
        contest.url = "https://leetcode.com/contest/" + data[i].titleSlug;
        leetcodeContests.push(contest);
      }
    });
  return leetcodeContests;
};

const saveContestsToDB = async (contests) => {
  for (const contest of contests) {
    await Contest.findOneAndUpdate({ contestId: contest.contestId }, contest, {
      upsert: true,
    });
  }
};

export const fetchAndSaveContests = async () => {
  try {
    const [codeforces, codechef, leetcode] = await Promise.all([
      fetchCodeforcesContests(),
      fetchCodechefContests(),
      fetchLeetcodeContests(),
    ]);

    const allContests = [...codeforces, ...codechef, ...leetcode];
    allContests.sort((a, b) => {
      if (a.contestStatus === "UPCOMING" && b.contestStatus === "UPCOMING") {
        // Ascending order for upcoming contests
        return a.startTime - b.startTime;
      } else if (
        a.contestStatus === "FINISHED" &&
        b.contestStatus === "FINISHED"
      ) {
        // Descending order for finished contests
        return b.startTime - a.startTime;
      } else {
        // Ensure upcoming contests appear before finished contests
        return a.contestStatus === "UPCOMING" ? -1 : 1;
      }
    });

    await saveContestsToDB(allContests);
  } catch (error) {
    console.error("Error fetching contests:", error.message);
  }
};

export const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();
    res.status(200).json({ success: true, contests });
  } catch (error) {
    console.error("Error fetching contests from database:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch contests" });
  }
};

export const addSolution = async (req, res) => {
  try {
    const { contestId, youtubeLink } = req.body;
    if (!contestId || !youtubeLink) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const contest = await Contest.findOne({ contestId });
    if (!contest) return res.status(404).send("Contest not found");

    contest.youtubeLink = youtubeLink;
    await contest.save();

    res.status(200).json({ message: "YouTube link added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Schedule fetching contests every 2 hours
setInterval(() => {
  console.log("Fetching Contests from Codechef, Codeforces and Leetcode.");
  fetchAndSaveContests()
    .then(() => console.log("Scheduled contest fetch completed"))
    .catch((err) => console.error("Contest fetch error:", err));
}, 2 * 60 * 60 * 1000); // 2 hours
