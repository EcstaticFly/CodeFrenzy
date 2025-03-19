import express from "express";
import {
  getAllContests,
  addSolution,
} from "../controllers/contestController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/all", getAllContests);
router.post("/addSolution", adminAuth, addSolution);

export default router;
