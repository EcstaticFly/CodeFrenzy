import dotenv from "dotenv";
dotenv.config();
const adminEmails = process.env.ADMIN_EMAILS.split(",");

export const adminAuth = (req, res, next) => {
  const { userEmail } = req.body;
  // console.log(userEmail);
  if (userEmail && adminEmails.includes(userEmail)) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
