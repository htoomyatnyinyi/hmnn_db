import pool from "../config/databases/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import session from "express-session";

import { validateEmail, validatePhoneNumber } from "../models/Auth.js";

// Configure express-session
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 3600000 }, // 1 hour
};

export const registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    // Normalize phone number (remove non-numeric characters)
    const normalizedPhone = phone.replace(/\D/g, "");

    // Check if the user already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM userAccount WHERE username = ? OR email = ? OR phone = ?",
      [username, email, normalizedPhone]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Username, email, or phone number already exists" });
    }

    // Hash the password
    // const saltRounds = 10;
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const [result] = await pool.query(
      "INSERT INTO userAccount (username, email, phone, password) VALUES (?, ?, ?, ?)",
      [username, email, normalizedPhone, hashedPassword]
    );
    // Generate a JWT token
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the session
    req.session.user = { id: result.insertId, username };

    // Respond with the newly created user (excluding the password)
    res.status(201).json({
      message: "User registered successfully",
      accessToken: token,
      user: {
        id: result.insertId,
        username,
        email,
        phone: normalizedPhone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};

export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Validate the identifier (username, email, or phone number)
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: "Identifier and password are required" });
    }

    // Determine if the identifier is an email, phone number, or username
    let query;
    let queryParams;
    if (validateEmail(identifier)) {
      query = "SELECT * FROM userAccount WHERE email = ?";
      queryParams = [identifier];
    } else if (validatePhoneNumber(identifier)) {
      // Normalize phone number (remove non-numeric characters)
      const normalizedPhone = identifier.replace(/\D/g, "");
      query = "SELECT * FROM userAccount WHERE phone = ?";
      queryParams = [normalizedPhone];
    } else {
      query = "SELECT * FROM userAccount WHERE username = ?";
      queryParams = [identifier];
    }

    // Check if the user exists
    const [user] = await pool.query(query, queryParams);
    console.log(user, "user");

    if (user.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid username, email, or phone number" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the session
    req.session.user = { id: user[0].id, username: user[0].username };

    // Send both the accessToken and user details
    res.json({
      accessToken: token,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        phone: user[0].phone, // Include phone number if needed
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Could not log out, please try again." });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
};

// Delete user profile
export const deleteAccount = async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "username",
    "email",
    "password",
    "first_name",
    "last_name",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// // Get user profile
// export const getProfile = async (req, res) => {
//   res.send(req.user);
// };

// // Get all users
// export const getUsers = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM userAccount");
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Get a single user
// export const getUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [user] = await pool.query("SELECT * FROM userAccount WHERE id = ?", [
//       id,
//     ]);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
