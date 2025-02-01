import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

import authRoutes from "./src/routes/authRoutes.js";
// import profileRoutes from "./src/routes/profileRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend to access cookies
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // secret: "your_secret_key", // Replace with a strong secret key
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // Session expiration time (1 day)
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/hmnn/profile", profileRoutes);

export default app;

// import express from "express";
// import cors from "cors";

// import authRoutes from "./src/routes/authRoutes.js";
// import userRoutes from "./src/routes/userRoutes.js";

// const server = express();

// // Middleware
// server.use(cors());
// server.use(express.json());

// // Routes
// server.use("/api/auth", authRoutes);
// server.use("/api/users", userRoutes);
// // app.use("/api/jobs", jobRoutes);
// // app.use("/api/profile", profileRoutes);
// // app.use("/api/applications", applicationRoutes);

// export default server;

// // const jobRoutes = require('./routes/jobRoutes');
// // const profileRoutes = require('./routes/profileRoutes');
// // const applicationRoutes = require('./routes/applicationRoutes');
