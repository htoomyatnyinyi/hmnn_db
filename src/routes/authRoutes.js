import express from "express";

import { register, login } from "../controller/authController.js";
import { getUsers } from "../models/User.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all", getUsers);

export default router;
