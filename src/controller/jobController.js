import pool from "../config/databases/db.js";

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      location,
      address,
      company_name,
      license,
      category,
      company_logo,
      post_img,
      employmentType,
      responsibilities,
      requirements,
    } = req.body;

    // Insert into jobPost table
    const [result] = await pool.query(
      `INSERT INTO jobPost (title, description, salary, location, address, company_name, license, category, company_logo, post_img, employmentType) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        salary,
        location,
        address,
        company_name,
        license,
        category,
        company_logo,
        post_img,
        employmentType,
      ]
    );
    const jobId = result.insertId;

    // Insert responsibilities
    for (const responsibility of responsibilities) {
      await pool.query(
        `INSERT INTO jobResponsibilities (post_id, responsibility) VALUES (?, ?)`,
        [jobId, responsibility]
      );
    }

    // Insert requirements
    for (const requirement of requirements) {
      await pool.query(
        `INSERT INTO jobRequirements (post_id, requirement) VALUES (?, ?)`,
        [jobId, requirement]
      );
    }

    res.status(201).json({ message: "Job created successfully", jobId });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getJobs = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        jp.*, 
        GROUP_CONCAT(jr.responsibility SEPARATOR ', ') AS responsibilities, 
        GROUP_CONCAT(jrq.requirement SEPARATOR ', ') AS requirements 
      FROM 
        jobPost jp
      LEFT JOIN 
        jobResponsibilities jr ON jp.id = jr.post_id
      LEFT JOIN 
        jobRequirements jrq ON jp.id = jrq.post_id
      GROUP BY 
        jp.id
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[job]] = await pool.query(
      `
      SELECT 
        jp.*, 
        GROUP_CONCAT(jr.responsibility SEPARATOR ', ') AS responsibilities, 
        GROUP_CONCAT(jrq.requirement SEPARATOR ', ') AS requirements 
      FROM 
        jobPost jp
      LEFT JOIN 
        jobResponsibilities jr ON jp.id = jr.post_id
      LEFT JOIN 
        jobRequirements jrq ON jp.id = jrq.post_id
      WHERE 
        jp.id = ?
      GROUP BY 
        jp.id
    `,
      [id]
    );

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateJob = async (req, res) => {
  console.log(req.body, "at updateJob");
  try {
    const { id } = req.params;
    const {
      title,
      description,
      salary,
      location,
      address,
      company_name,
      license,
      category,
      company_logo,
      post_img,
      employmentType,
      responsibilities,
      requirements,
    } = req.body;

    // Update jobPost table
    await pool.query(
      `UPDATE jobPost 
       SET title = ?, description = ?, salary = ?, location = ?, address = ?, company_name = ?, 
           license = ?, category = ?, company_logo = ?, post_img = ?, employmentType = ? 
       WHERE id = ?`,
      [
        title,
        description,
        salary,
        location,
        address,
        company_name,
        license,
        category,
        company_logo,
        post_img,
        employmentType,
        id,
      ]
    );

    // Delete existing responsibilities
    await pool.query(`DELETE FROM jobResponsibilities WHERE post_id = ?`, [id]);

    // Insert updated responsibilities
    for (const responsibility of responsibilities) {
      await pool.query(
        `INSERT INTO jobResponsibilities (post_id, responsibility) VALUES (?, ?)`,
        [id, responsibility]
      );
    }

    // Delete existing requirements
    await pool.query(`DELETE FROM jobRequirements WHERE post_id = ?`, [id]);

    // Insert updated requirements
    for (const requirement of requirements) {
      await pool.query(
        `INSERT INTO jobRequirements (post_id, requirement) VALUES (?, ?)`,
        [id, requirement]
      );
    }

    res.status(200).json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM jobPost WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createJob, getJobs, getJobById, updateJob, deleteJob };

// ÷/ BEFORE EDITS

// import { getJobs, findJobById, createJob } from "../models/Job.js";

// const jobs = async (req, res) => {
//   const job = await getJobs();
//   res.status(200).send(job);
// };

// const createNewJob = async (req, res) => {
//   const { title, description, location, salary, company } = req.body;

//   const job = await createJob(title, description, location, salary, company);

//   res.status(201).send(job);
// };

// const job = async (req, res) => {
//   console.log(req.params, "at job");
//   // console.log(req.user, "at job");

//   // Check if user is authenticated (assuming 'id' exists on req.user)
//   if (!req.params || !req.params.id) {
//     return res.status(401).json({ error: "Unauthorized access" });
//   }
//   // if (!req.user || !req.user.id) {
//   //   return res.status(401).json({ error: "Unauthorized access" });
//   // }

//   // const id = req.user.id;
//   const id = req.params.id;

//   const job = await findJobById(id);
//   res.status(200).send(job);
// };

// // const job = async (req, res) => {
// //   console.log(req.user, "at job");

// //   const id = req.user.id;

// //   const job = await findJobById(id);
// //   res.status(200).send(job);
// // };

// // // ############
// // // UPDATE CODE
// // // ############

// // // Fetch all jobs with applied status for a specific user
// // const getJobs = async (req, res) => {
// //   // const { user_id } = req.query;
// //   const user_id = req.user.id;

// //   try {
// //     // Fetch all jobs
// //     const [jobs] = await pool.query("SELECT * FROM jobPost");

// //     // If user_id is provided, check if the user has applied for each job
// //     if (user_id) {
// //       const jobsWithApplicationStatus = await Promise.all(
// //         jobs.map(async (job) => {
// //           const [application] = await pool.query(
// //             "SELECT status FROM userAppliedJob WHERE user_id = ? AND post_id = ?",
// //             [user_id, job.id]
// //           );
// //           return {
// //             ...job,
// //             applied: application.length > 0,
// //             application_status:
// //               application.length > 0 ? application[0].status : null,
// //           };
// //         })
// //       );
// //       return res.json(jobsWithApplicationStatus);
// //     }

// //     // If no user_id is provided, return all jobs without application status
// //     res.json(jobs);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // Create a new job post
// // const createJob = async (req, res) => {
// //   const {
// //     title,
// //     description,
// //     salary,
// //     location,
// //     address,
// //     company_name,
// //     license,
// //     category,
// //     company_logo,
// //     post_img,
// //     employmentType,
// //   } = req.body;

// //   try {
// //     const [result] = await pool.query(
// //       "INSERT INTO jobPost (title, description, salary, location, address, company_name, license, category, company_logo, post_img, employmentType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
// //       [
// //         title,
// //         description,
// //         salary,
// //         location,
// //         address,
// //         company_name,
// //         license,
// //         category,
// //         company_logo,
// //         post_img,
// //         employmentType,
// //       ]
// //     );
// //     res.status(201).json({ id: result.insertId, ...req.body });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// export { jobs, createNewJob, job, getJobs, createJob };
