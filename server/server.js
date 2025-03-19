import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./configs/mongoDB.js";
import contestRoutes from "./routes/contestRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();
import { fetchAndSaveContests } from "./controllers/contestController.js";
import { updateYoutubeLinks } from "./controllers/youtubeController.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/contests", contestRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  fetchAndSaveContests();
  setTimeout(() => {
    console.log("Starting initial YouTube solution sync...");
    updateYoutubeLinks()
      .then(() => console.log("Initial YouTube sync completed"))
      .catch((err) => console.error("Initial YouTube sync error:", err));
  }, 25 * 1000);
});
