import express from "express";

import {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
} from "../controller/jobController.js";
import isAuthenticated from "../middleware/Authenticated.js";

const router = express.Router();

// GET /jobs - Fetch all jobs (with applied status if user_id is provided)
router.get("/jobs", isAuthenticated, getJobs);

// GET /job/:id - Fetch a specific job by ID
router.get("/job/:id", getJobById);

//PATCH /job/:id - Update a specific job by ID
router.patch("/job/:id", updateJob);

// DELETE /job/:id - Delete a specific job by ID
router.delete("/job/:id", deleteJob);

// POST /jobs - Create a new job post
router.post("/create-job", createJob);

export default router;
