import { generateToken } from "../configs/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import randomstring from "randomstring";
import nodemailer from "nodemailer";
import dotenv, { config } from "dotenv";
config();

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
    });

    if (newUser) {
      await generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
        message: "Account created successfully",
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    await generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      message: "Logged in successfully",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 0,
      path: "/",
    });
    res.json({ message: "Logout successful" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const checkUser = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const otpCache = {};

function generateOtp() {
  return randomstring.generate({ length: 6, charset: "numeric" });
}

async function sendOtp(email, otp) {
  try {
    const mailOptions = {
      from: "otp.shopex@gmail.com",
      to: email,
      subject: "Otp verification",
      text: `Your CodeFrenzy Otp for verification is ${otp}. DO NOT share it with anyone.`,
    };
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.SECRET_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Error occured: ", error);
      else console.log("OTP sent successfully: ", info.response);
    });
    return true;
  } catch (e) {
    console.log("Otp sending fail.");
    return false;
  }
}

export const getOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOtp();
    otpCache[email] = await bcrypt.hash(otp, 10);

    const result = await sendOtp(email, otp);
    if (result) {
      res.cookie("otpCache", otpCache, {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({ message: "OTP sent succesfully" });
    } else {
      res.status(400).json({ message: "Failed to send OTP." });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { formData, givenOTP } = req.body;
  const actualOTPCache = req.cookies.otpCache;
  const decodedOtp = await bcrypt.compare(
    givenOTP.trim(),
    actualOTPCache[formData.email]
  );
  if (!actualOTPCache) {
    return res.status(400).json({ message: "OTP expired." });
  }
  if (!actualOTPCache.hasOwnProperty(formData.email)) {
    return res.status(400).json({ message: "Email not found,try again" });
  }

  if (decodedOtp) {
    delete otpCache[formData.email];
    return res
      .status(200)
      .clearCookie("otpCache")
      .json({ success: true, message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};
