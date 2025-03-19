import express from "express";
import { getAllContests } from "../controllers/contestController.js";

const router = express.Router();

router.get("/all", getAllContests);

export default router;
