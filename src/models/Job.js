// // import pool from "../config/databases/db.js";
// import pool from "../config/databases/db.js";

// const createJob = async (req, res) => {
//   const { title, description, location, salary, company } = req.body;
//   console.log(title, description, location, salary, company, "check");
//   // try {
//   //   const [result] = await pool.query(
//   //     "INSERT INTO jobs (title, description, location, salary) VALUES (?, ?, ?, ?)",
//   //     [title, description, location, salary]
//   //   );
//   //   res
//   //     .status(201)
//   //     .json({ message: "Job created successfully", jobId: result.insertId });
//   // } catch (error) {
//   //   console.error("Error creating job:", error);
//   //   res.status(500).json({ error: "Internal server error" });
//   // }
// };

// const getJobs = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM jobs");
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const findJobById = async (id) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
//     return rows[0]; // Return the first matching job
//   } catch (error) {
//     console.error("Error finding job by id:", error);
//     throw error;
//   }
// };

// export { createJob, getJobs, findJobById }; // import pool from "../config/databases/db.js";

// // const getJobs = async () => {
// //   try {
// //     const [rows] = await pool.query("SELECT * FROM jobs");
// //     return rows;
// //   } catch (error) {
// //     console.error("Error fetching jobs:", error);
// //     throw error;
// //   }
// // };

// // const createJob = async (title, description, locaiton, salary, company) => {
// //   console.log(title, description, locaiton, salary, company, "check");
// //   try {
// //     const [result] = await pool.query(
// //       "INSERT INTO jobs (title, description, location, salary) VALUES (?,?,?,?)",
// //       [title, description, locaiton, salary]
// //     );
// //     return result.insertId;
// //   } catch (error) {
// //     console.error(error);
// //     res.sendStatus(400); // Replace with appropriate status code based on the error
// //   }
// // };
// // // const createJob = async (title, description, locaiton, salary, company) => {
// // //   console.log(title, description, locaiton, salary, company, "check");
// // //   try {
// // //     const [result] = await pool.query(
// // //       "INSERT INTO jobs (title, description, location, salary) VALUES (?,?,?,?)",
// // //       [title, description, locaiton, salary]
// // //     );
// // //     return result.insertId;
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(400).json({ message: "Bad request" }); // Send a more informative error message
// // //   }
// // // };

// // const findJobById = async (id) => {
// //   try {
// //     const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
// //     return rows[0]; // Return the first matching job
// //   } catch (error) {
// //     console.error("Error finding job by id:", error);
// //     throw error;
// //   }
// // };

// // // const a = await getJobs();
// // // const b= await findJobById(1);
// // // console.log(a,b);

// // export { getJobs, createJob, findJobById };

// // // // ### GEMINI GENREATE
// // // const Job = require('../models/Job');

// // // exports.createJob = async (req, res) => {
// // //   try {
// // //     const newJob = new Job(req.body);
// // //     const savedJob = await newJob.save();
// // //     res.status(201).json(savedJob);
// // //   } catch (err) {
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // };

// // // exports.getAllJobs = async (req, res) => {
// // //   try {
// // //     const jobs = await Job.find();
// // //     res.status(200).json(jobs);
// // //   } catch (err) {
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // };

// // // exports.getJobById = async (req, res) => {
// // //   try {
// // //     const job = await Job.findById(req.params.id);
// // //     if (!job) {
// // //       return res.status(404).json({ error: 'Job not found' });
// // //     }
// // //     res.status(200).json(job);
// // //   } catch (err) {
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // };

// // // exports.updateJob = async (req, res) => {
// // //   try {
// // //     const updatedJob = await Job.findByIdAndUpdate(
// // //       req.params.id,
// // //       req.body,
// // //       { new: true } // Return the updated document
// // //     );
// // //     if (!updatedJob) {
// // //       return res.status(404).json({ error: 'Job not found' });
// // //     }
// // //     res.status(200).json(updatedJob);
// // //   } catch (err) {
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // };

// // // exports.deleteJob = async (req, res) => {
// // //   try {
// // //     const deletedJob = await Job.findByIdAndDelete(req.params.id);
// // //     if (!deletedJob) {
// // //       return res.status(404).json({ error: 'Job not found' });
// // //     }
// // //     res.status(200).json({ message: 'Job deleted successfully' });
// // //   } catch (err) {
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // };
