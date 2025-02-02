import express from "express";
import {
  registerUser,
  loginUser,
  deleteAccount,
  updateProfile,
} from "../controller/userController.js";

import isAuthenticated from "../middleware/Authenticated.js";

const router = express.Router();

// router.get("/me", isAuthenticated, profile);
// router.get("/all", isAuthenticated, users);
router.delete("/me", isAuthenticated, deleteAccount);
router.patch("/me", isAuthenticated, updateProfile);

// POST /users/register - Register a new user
router.post("/register", registerUser);

// POST /users/login - Login a user
router.post("/login", loginUser);


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
