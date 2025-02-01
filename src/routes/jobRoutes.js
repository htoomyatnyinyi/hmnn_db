import express from "express";

import { jobs, job } from "../controller/jobController.js";
import isAuthenticated from "../middleware/Authenticated.js";

const router = express.Router();

router.get("/jobs", isAuthenticated, jobs);
router.get("/job/:id", isAuthenticated, job);

export default router;
