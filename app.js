import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";

// import authRoutes from "./src/routes/authRoutes.js";
// import profileRoutes from "./src/routes/profileRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";

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

// Use body-parser middleware to parse JSON
app.use(bodyParser.json());

// Error handling for invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next();
});

// Routes
// app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);
// app.use("/hmnn/profile", profileRoutes);

export default app;
