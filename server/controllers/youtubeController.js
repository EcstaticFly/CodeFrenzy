import { google } from "googleapis";
import Contest from "../models/contest.js";
import dotenv from "dotenv";
dotenv.config();

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

// Playlist IDs
const playlists = {
  Leetcode: "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr",
  Codeforces: "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB",
  Codechef: "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr",
};

function formatContestTitle(contestTitle, site) {
  if (site === "Codechef" && contestTitle.startsWith("Starters")) {
    const match = contestTitle.match(/(Starters \d+)/);
    if (match) {
      return match[0];
    }
  }

  if (site === "Codeforces") {
    if (contestTitle.startsWith("Codeforces Round")) {
      const match = contestTitle.match(/(Codeforces Round \d+)/);
      if (match) {
        return match[0];
      }
    }

    if (contestTitle.startsWith("Educational Codeforces Round")) {
      const match = contestTitle.match(/(Educational Codeforces Round \d+)/);
      if (match) {
        return match[0];
      }
    }
  }

  return contestTitle; // Return the original title if no conditions match
}

// Fetch YouTube links
export const fetchYoutubeLinks = async (contest) => {
  try {
    const playlistId = playlists[contest.site];
    if (!playlistId) {
      console.log(`No playlist found for site: ${contest.site}`);
      return null;
    }

    console.log(
      `Fetching YouTube links for ${contest.title} from ${contest.site}`
    );

    const response = await youtube.playlistItems.list({
      part: "snippet",
      playlistId,
      maxResults: 70,
    });

    if (!response.data.items) {
      console.log(`No items found in playlist: ${playlistId}`);
      return null;
    }

    const videos = response.data.items;

    for (const video of videos) {
      if (
        video.snippet.title
          .toLowerCase()
          .includes(
            formatContestTitle(contest.title, contest.site).toLowerCase()
          )
      ) {
        const videoId = video.snippet.resourceId.videoId;
        console.log(`Video found: ${video.snippet.title} (ID: ${videoId})`);
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
    console.log(`No video found matching ${contest.title}`);
    return null;
  } catch (error) {
    console.error(
      `Error fetching YouTube link for ${contest.title}:`,
      error.message
    );
    return null;
  }
};

// Attach YouTube links to finished contests
export const updateYoutubeLinks = async (req, res) => {
  try {
    console.log("Updating YouTube links...");
    const finishedContests = await Contest.find({
      contestStatus: "FINISHED",
      youtubeLink: { $exists: false },
    });

    for (const contest of finishedContests) {
      const youtubeLink = await fetchYoutubeLinks(contest);

      if (youtubeLink) {
        contest.youtubeLink = youtubeLink;
        await contest.save();
        console.log(
          `Attached YouTube link for ${contest.title}: ${youtubeLink}`
        );
      }
    }

    if (res) {
      res.status(200).json({
        success: true,
        message: "YouTube links updated successfully.",
      });
    }
  } catch (error) {
    console.error("Error updating YouTube links:", error.message);
    if (res) {
      res
        .status(500)
        .json({ success: false, message: "Failed to update YouTube links." });
    }
  }
};

//Schedule youtube sync every 6 hrs
setInterval(() => {
  console.log("Running scheduled YouTube solution sync...");
  updateYoutubeLinks()
    .then(() => console.log("Scheduled YouTube sync completed"))
    .catch((err) => console.error("YouTube sync error:", err));
}, 6 * 60 * 60 * 1000); //6 hrs
