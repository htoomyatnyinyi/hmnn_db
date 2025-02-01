import express from "express";
import { userProfile } from "../controller/userController.js";
import isAuthenticated from "../middleware/authMiddleware.js"; // Import the middleware

const router = express.Router();

// Protect the profile route with the isAuthenticated middleware
router.get("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await userProfile(id);
    if (profile) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
