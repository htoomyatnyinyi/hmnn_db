import pool from "../config/databases/db.js";

import fs from "fs";
import path from "path";

// Upload file resume
const uploadFileResume = async (req, res) => {
  try {
    const { user_id } = req.body;

    console.log(req.file, "at fileResumeController.js");
    if (!user_id || !req.file) {
      return res.status(400).json({ message: "User ID and file are required" });
    }

    const file_path = req.file.path;
    const file_name = req.file.filename;
    const file_type = req.file.mimetype;

    const [result] = await pool.execute(
      `INSERT INTO fileResume (user_id, file_path, file_name, file_type) VALUES (?, ?, ?, ?)`,
      [user_id, file_path, file_name, file_type]
    );

    res
      .status(201)
      .json({ message: "File uploaded successfully", fileId: result.insertId });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all files of a user
const getUserFiles = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [files] = await pool.execute(
      `SELECT id, file_name, file_type, file_path, uploaded_at FROM fileResume WHERE user_id = ?`,
      [user_id]
    );

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a file resume
const deleteFileResume = async (req, res) => {
  try {
    const { id } = req.params;

    const [file] = await pool.execute(
      `SELECT file_path FROM fileResume WHERE id = ?`,
      [id]
    );

    if (file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = file[0].file_path;

    // Delete file from storage
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    await pool.execute(`DELETE FROM fileResume WHERE id = ?`, [id]);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { uploadFileResume, getUserFiles, deleteFileResume };
