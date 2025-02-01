import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";

const server = express();

// Middleware
server.use(cors());
server.use(express.json());

// Routes
server.use("/api/auth", authRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/applications", applicationRoutes);

export default server;

// const authRoutes = require('./routes/authRoutes');
// const jobRoutes = require('./routes/jobRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const applicationRoutes = require('./routes/applicationRoutes');
