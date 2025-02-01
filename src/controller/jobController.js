import { getJobs, findJobById } from "../models/Job.js";

const jobs = async (req, res) => {
  const job = await getJobs();
  res.status(200).send(job);
};

const createJob = async (req, res) => {
  const { title, description } = req.body;
  const job = await createJob(title, description);
  res.status(201).send(job);
};

const job = async (req, res) => {
  console.log(req.params, "at job");
  // console.log(req.user, "at job");

  // Check if user is authenticated (assuming 'id' exists on req.user)
  if (!req.params || !req.params.id) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  // if (!req.user || !req.user.id) {
  //   return res.status(401).json({ error: "Unauthorized access" });
  // }

  // const id = req.user.id;
  const id = req.params.id;

  const job = await findJobById(id);
  res.status(200).send(job);
};

// const job = async (req, res) => {
//   console.log(req.user, "at job");

//   const id = req.user.id;

//   const job = await findJobById(id);
//   res.status(200).send(job);
// };

export { jobs, createJob, job };
