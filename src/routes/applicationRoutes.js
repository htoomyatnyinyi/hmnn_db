import express from "express";
import {
  applyForJob,
  getAppliedJobs,
} from "../controller/applicationController.js";
import isAuthenticated from "../middleware/Authenticated.js";

const router = express.Router();

// Middleware to extract user ID from cookies
const getUserIdFromCookies = (req, res, next) => {
  const userId = req.cookies.userId; // Assuming the cookie name is "userId"
  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User ID not found in cookies" });
  }
  req.userId = userId; // Attach the user ID to the request object
  next();
};

// POST /users/applied-jobs - Apply for a job
router.post("/apply-job", isAuthenticated, applyForJob);

// GET /users/applied-jobs - Fetch all jobs applied by the logged-in user
router.get("/applied-jobs", isAuthenticated, getAppliedJobs);

export default router;

// import express from "express";

// import {
//   applyForJob,
//   getAppliedJobs,
// } from "../controller/applicationController.js";
// const router = express.Router();

// // POST /users/:id/applied-jobs - Apply for a job
// router.post("/:id/applied-jobs", applyForJob);

// // GET /users/:id/applied-jobs - Fetch all jobs applied by a specific user
// router.get("/:id/applied-jobs", getAppliedJobs);

// export default router;
