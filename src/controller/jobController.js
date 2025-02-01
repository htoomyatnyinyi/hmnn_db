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
  const job = await findJobById(id);
  res.status(200).send(job);
};

export { jobs, createJob, job };
