import express from "express";
import multer from "multer";

import {
  uploadFileResume,
  getUserFiles,
  deleteFileResume,
} from "../controller/fileResumeController.js";
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to upload file resume
router.post("/upload", upload.single("file"), uploadFileResume);

// Route to get all resumes of a user
router.get("/:user_id", getUserFiles);

// Route to delete a file resume
router.delete("/delete/:id", deleteFileResume);

export default router;
