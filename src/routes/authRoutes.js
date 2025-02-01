import express from "express";

import { register, login } from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logout successful" });
  });
});
export default router;
