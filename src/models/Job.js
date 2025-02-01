import pool from "../config/databases/db.js";

const getJobs = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM jobs");
    return rows;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

const createJob = async (title, description) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO jobs (title, description) VALUES (?, ?)",
      [title, description]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

const findJobById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
    return rows[0]; // Return the first matching job
  } catch (error) {
    console.error("Error finding job by id:", error);
    throw error;
  }
};

// const a = await getJobs();
// const b= await findJobById(1);
// console.log(a,b);

export { getJobs, createJob, findJobById };

// // ### GEMINI GENREATE
// const Job = require('../models/Job');

// exports.createJob = async (req, res) => {
//   try {
//     const newJob = new Job(req.body);
//     const savedJob = await newJob.save();
//     res.status(201).json(savedJob);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find();
//     res.status(200).json(jobs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getJobById = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) {
//       return res.status(404).json({ error: 'Job not found' });
//     }
//     res.status(200).json(job);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateJob = async (req, res) => {
//   try {
//     const updatedJob = await Job.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true } // Return the updated document
//     );
//     if (!updatedJob) {
//       return res.status(404).json({ error: 'Job not found' });
//     }
//     res.status(200).json(updatedJob);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteJob = async (req, res) => {
//   try {
//     const deletedJob = await Job.findByIdAndDelete(req.params.id);
//     if (!deletedJob) {
//       return res.status(404).json({ error: 'Job not found' });
//     }
//     res.status(200).json({ message: 'Job deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
