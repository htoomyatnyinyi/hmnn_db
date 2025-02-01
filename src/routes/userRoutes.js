import express from "express";
import { users, profile } from "../controller/userController.js";

import isAuthenticated from "../middleware/Authenticated.js";

const router = express.Router();

router.get("/me", isAuthenticated, profile);
router.get("/all", isAuthenticated, users);

export default router;
