import express from "express";
import {
  register,
  login,
  logout,
  checkUser,
  getOtp,
  verifyOtp,
} from "../controllers/authController.js";
import { verifyjwt } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", verifyjwt, checkUser);
router.post("/sendOtp", getOtp);
router.post("/verifyOtp", verifyOtp);

export default router;
