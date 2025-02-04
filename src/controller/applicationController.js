import pool from "../config/databases/db.js";

// Apply for a job
const applyForJob = async (req, res) => {
  const userId = req.session.user.id;
  console.log(userId, "at applyForJob");
  const { post_id, resume_id } = req.body;

  if (!post_id || !resume_id) {
    return res
      .status(400)
      .json({ message: "post_id and resume_id are required" });
  }

  try {
    const [existingApplication] = await pool.query(
      "SELECT * FROM userAppliedJob WHERE user_id = ? AND post_id = ?",
      [userId, post_id]
    );

    if (existingApplication.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const [result] = await pool.query(
      `INSERT INTO userAppliedJob (user_id, post_id, resume_id, status, applied)
       VALUES (?, ?, ?, 'pending', TRUE)`,
      [userId, post_id, resume_id]
    );

    res.status(201).json({
      message: "Job application submitted successfully",
      applicationId: result.insertId,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res
      .status(500)
      .json({ message: "Error applying for job", error: error.message });
  }
};

// Get all jobs applied by a specific user
const getAppliedJobs = async (req, res) => {
  const { id: user_id } = req.session.user;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM userAppliedJob WHERE user_id = ?",
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific job application by ID (if needed)
const getAppliedJobById = async (req, res) => {
  const { id } = req.params; // Get the application ID from the URL parameters
  const userId = req.session.user.id;

  try {
    const [row] = await pool.query(
      "SELECT * FROM userAppliedJob WHERE id = ? AND user_id = ?", // Ensure user owns the application
      [id, userId]
    );

    if (row.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(row[0]); // Send the single application object
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the status of a job application (e.g., by admin or user)
const updateAppliedJobStatus = async (req, res) => {
  const { id } = req.params; // Get the application ID from the URL parameters
  const { status } = req.body; // Get the new status from the request body
  const userId = req.session.user.id; // or get user ID however your auth works

  try {
    const [result] = await pool.query(
      "UPDATE userAppliedJob SET status = ? WHERE id = ? AND user_id = ?",
      [status, id, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Application not found or not authorized" });
    }

    res.json({ message: "Application status updated successfully" }); // 200 is implied here
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a job application
const deleteAppliedJob = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id;

  try {
    const [result] = await pool.query(
      "DELETE FROM userAppliedJob WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Application not found or not authorized" });
    }

    res.status(204).end(); // 204 No Content is a common response for successful DELETE
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const {user_id, post_id, status} = req.body;
// const resumeIdQuery = `SELECT id FROM profileResume WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`;
// const query = `INSERT INTO userAppliedJob (user_id, post_id, resume_id, status) VALUES (1, 123, (SELECT id FROM profileResume WHERE user_id = 1 ORDER BY created_at DESC LIMIT 1),'pending')`;
// const params = [1, 123, 1, "pending"];

export {
  applyForJob,
  getAppliedJobs,
  getAppliedJobById,
  updateAppliedJobStatus,
  deleteAppliedJob,
};

// ... rest of your app setup
// In your main app.js or server.js file:
// const { applyForJob } = require('./your-file-containing-the-functions'); // or import if using ES modules
// app.post("/apply-job", applyForJob);  // Define the route here// import pool from "../config/databases/pool.js";

// const applyForJob = async (req, res) => {
//   const userId = req.session.user.id; // Extracted from cookies
//   console.log(userId, "at applyForJob");

//   app.post("/apply-job", (req, res) => {
//     console.log("Request Body:", req.body);

//   const { post_id, resume_id } = req.body; // Extract job post ID and resume ID from the request body

//   // Validate request body
//   if (!post_id || !resume_id) {
//     return res
//       .status(400)
//       .json({ message: "post_id and resume_id are required" });
//   }

//   try {
//     // Check if the user has already applied for this job
//     const [existingApplication] = await pool.query(
//       "SELECT * FROM userAppliedJob WHERE user_id = ? AND post_id = ?",
//       [userId, post_id]
//     );

//     if (existingApplication.length > 0) {
//       return res
//         .status(400)
//         .json({ message: "You have already applied for this job" });
//     }

//     // Insert the new application into the database
//     const [result] = await pool.query(
//       `INSERT INTO userAppliedJob (user_id, post_id, resume_id, status, applied)
//        VALUES (?, ?, ?, 'pending', TRUE)`,
//       [userId, post_id, resume_id]
//     );

//     // Return success response
//     res.status(201).json({
//       message: "Job application submitted successfully",
//       applicationId: result.insertId,
//     });
//   } catch (error) {
//     console.error("Error applying for job:", error);
//     res
//       .status(500)
//       .json({ message: "Error applying for job", error: error.message });
//   }
// })
// };

// // Get all jobs applied by a specific user
// const getAppliedJobs = async (req, res) => {
//   const { id: user_id } = req.session.user;

//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM userAppliedJob WHERE user_id = ?",
//       [user_id]
//     );
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export { applyForJob, getAppliedJobs };

// // Apply for a job
// const applyForJob = async (req, res) => {
//   const { id: user_id } = req.session.user;

//   // const { id: user_id } = req.params;
//   const { post_id, resume_id, status = "pending" } = req.body;

//   try {
//     // Check if the job post exists
//     const [jobPost] = await pool.query("SELECT * FROM jobPost WHERE id = ?", [
//       post_id,
//     ]);
//     if (jobPost.length === 0) {
//       return res.status(404).json({ error: "Job post not found" });
//     }

//     // Check if the user has already applied for this job
//     const [existingApplication] = await pool.query(
//       "SELECT * FROM userAppliedJob WHERE user_id = ? AND post_id = ?",
//       [user_id, post_id]
//     );
//     if (existingApplication.length > 0) {
//       return res
//         .status(400)
//         .json({ error: "You have already applied for this job" });
//     }

//     // Insert the application
//     const [result] = await pool.query(
//       "INSERT INTO userAppliedJob (user_id, post_id, resume_id, status) VALUES (?, ?, ?, ?)",
//       [user_id, post_id, resume_id, status]
//     );
//     res.status(201).json({ id: result.insertId, user_id, ...req.body });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
