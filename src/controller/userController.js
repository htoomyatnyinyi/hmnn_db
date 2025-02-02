import pool from "../config/databases/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import session from "express-session";

// Configure express-session
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 3600000 }, // 1 hour
};

// Register a new user
export const registerUser = async (req, res) => {
  const {
    username,
    email,
    phone,
    password,
    first_name,
    last_name,
    gender,
    date_of_birth,
    location,
    bios,
    profile_img,
    cover_img,
  } = req.body;

  try {
    // Check if the username or email already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM userAccount WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const [result] = await pool.query(
      "INSERT INTO userAccount (username, email, phone, password, first_name, last_name, gender, date_of_birth, location, bios, profile_img, cover_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        username,
        email,
        phone,
        hashedPassword,
        first_name,
        last_name,
        gender,
        date_of_birth,
        location,
        bios,
        profile_img,
        cover_img,
      ]
    );

    // Generate a JWT token
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the session
    req.session.user = { id: result.insertId, username };

    res.status(201).json({ token, user: { id: result.insertId, username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a user with username or email
export const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Check if the user exists by username or email
    const [user] = await pool.query(
      "SELECT * FROM userAccount WHERE username = ? OR email = ?",
      [usernameOrEmail, usernameOrEmail]
    );
    if (user.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid username/email or password" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Invalid username/email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the session
    req.session.user = { id: user[0].id, username: user[0].username };

    // Send both the accessToken and a session cookie
    res.json({
      accessToken: token,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// This code is only email and password to login the rest are the same the above code is both username and email with password can login
// import pool from "../config/databases/db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import session from "express-session";

// // Configure express-session
// const sessionConfig = {
//   secret: process.env.SESSION_SECRET || "your-secret-key",
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false, httpOnly: true, maxAge: 3600000 }, // 1 hour
// };

// // Register a new user
// export const registerUser = async (req, res) => {
//   const {
//     username,
//     email,
//     phone,
//     password,
//     first_name,
//     last_name,
//     gender,
//     date_of_birth,
//     location,
//     bios,
//     profile_img,
//     cover_img,
//   } = req.body;

//   try {
//     // Check if the username or email already exists
//     const [existingUser] = await pool.query(
//       "SELECT * FROM userAccount WHERE username = ? OR email = ?",
//       [username, email]
//     );
//     if (existingUser.length > 0) {
//       return res
//         .status(400)
//         .json({ error: "Username or email already exists" });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Insert the new user into the database
//     const [result] = await pool.query(
//       "INSERT INTO userAccount (username, email, phone, password, first_name, last_name, gender, date_of_birth, location, bios, profile_img, cover_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//       [
//         username,
//         email,
//         phone,
//         hashedPassword,
//         first_name,
//         last_name,
//         gender,
//         date_of_birth,
//         location,
//         bios,
//         profile_img,
//         cover_img,
//       ]
//     );

//     // Generate a JWT token
//     const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     // Set the session
//     req.session.user = { id: result.insertId, username };

//     res.status(201).json({ token, user: { id: result.insertId, username } });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Login a user
// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password, req.body);

//   try {
//     // Check if the user exists
//     const [user] = await pool.query(
//       "SELECT * FROM userAccount WHERE email = ?",
//       [email]
//     );
//     if (user.length === 0) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     // Compare the provided password with the hashed password
//     const isMatch = await bcrypt.compare(password, user[0].password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     // Set the session
//     req.session.user = { id: user[0].id, email: user[0].email };

//     res.json({
//       accessToken: token,
//       user: { id: user[0].id, email: user[0].email },
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete user profile
// export const deleteAccount = async (req, res) => {
//   try {
//     await req.user.remove();
//     res.send(req.user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// // Update user profile
// export const updateProfile = async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = [
//     "username",
//     "email",
//     "password",
//     "first_name",
//     "last_name",
//   ];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!" });
//   }

//   try {
//     updates.forEach((update) => (req.user[update] = req.body[update]));
//     await req.user.save();
//     res.send(req.user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

// // Logout user
// export const logoutUser = (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ error: "Could not log out, please try again." });
//     }
//     res.clearCookie("connect.sid"); // Clear the session cookie
//     res.status(200).json({ message: "Logged out successfully" });
//   });
// };
// //  this one only pure token I want to upgrade to cookies and accessToken
// // import pool from "../config/databases/db.js";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";

// // // Register a new user
// // export const registerUser = async (req, res) => {
// //   const {
// //     username,
// //     email,
// //     phone,
// //     password,
// //     first_name,
// //     last_name,
// //     gender,
// //     date_of_birth,
// //     location,
// //     bios,
// //     profile_img,
// //     cover_img,
// //   } = req.body;

// //   try {
// //     // Check if the username or email already exists
// //     const [existingUser] = await pool.query(
// //       "SELECT * FROM userAccount WHERE username = ? OR email = ?",
// //       [username, email]
// //     );
// //     if (existingUser.length > 0) {
// //       return res
// //         .status(400)
// //         .json({ error: "Username or email already exists" });
// //     }

// //     // Hash the password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     // Insert the new user into the database
// //     const [result] = await pool.query(
// //       "INSERT INTO userAccount (username, email, phone, password, first_name, last_name, gender, date_of_birth, location, bios, profile_img, cover_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
// //       [
// //         username,
// //         email,
// //         phone,
// //         hashedPassword,
// //         first_name,
// //         last_name,
// //         gender,
// //         date_of_birth,
// //         location,
// //         bios,
// //         profile_img,
// //         cover_img,
// //       ]
// //     );

// //     // Generate a JWT token
// //     const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
// //       expiresIn: "1h",
// //     });

// //     res.status(201).json({ token, user: { id: result.insertId, username } });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // Login a user
// // export const loginUser = async (req, res) => {
// //   const { email, password } = req.body;
// //   console.log(email, password, req.body);

// //   try {
// //     // Check if the user exists
// //     const [user] = await pool.query(
// //       "SELECT * FROM userAccount WHERE email = ?",
// //       [email]
// //     );
// //     if (user.length === 0) {
// //       return res.status(400).json({ error: "Invalid email or password" });
// //     }

// //     // Compare the provided password with the hashed password
// //     const isMatch = await bcrypt.compare(password, user[0].password);
// //     if (!isMatch) {
// //       return res.status(400).json({ error: "Invalid email or password" });
// //     }

// //     // Generate a JWT token
// //     const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
// //       expiresIn: "1h",
// //     });

// //     res.json({
// //       accessToken: token,
// //       user: { id: user[0].id, email: user[0].email },
// //     });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };
// // // Delete user profile
// // export const deleteAccount = async (req, res) => {
// //   try {
// //     await req.user.remove();
// //     res.send(req.user);
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // };

// // // Update user profile
// // export const updateProfile = async (req, res) => {
// //   const updates = Object.keys(req.body);
// //   const allowedUpdates = [
// //     "username",
// //     "email",
// //     "password",
// //     "first_name",
// //     "last_name",
// //   ];
// //   const isValidOperation = updates.every((update) =>
// //     allowedUpdates.includes(update)
// //   );

// //   if (!isValidOperation) {
// //     return res.status(400).send({ error: "Invalid updates!" });
// //   }

// //   try {
// //     updates.forEach((update) => (req.user[update] = req.body[update]));
// //     await req.user.save();
// //     res.send(req.user);
// //   } catch (error) {
// //     res.status(400).send(error);
// //   }
// // };

// // // import { getUsers } from "../models/User.js";

// // // const users = async (req, res) => {
// // //   // const { rows } = await getUsers();
// // //   const rows = await getUsers();
// // //   res.status(200).send(rows);
// // // };

// // // const profile = async (req, res) => {
// // //   const { rows } = await userPorfile(id);
// // //   console.log(rows, " at profle");
// // //   //   res.status(200).send(rows);
// // // };

// // // // Update user profile
// // // const updateProfile = async (req, res) => {
// // //   const updates = Object.keys(req.body);
// // //   const allowedUpdates = ["username", "email", "password", 'first_name', 'last_name'];
// // //   const isValidOperation = updates.every((update) =>
// // //     allowedUpdates.includes(update)
// // //   );

// // //   if (!isValidOperation) {
// // //     return res.status(400).send({ error: "Invalid updates!" });
// // //   }

// // //   try {
// // //     updates.forEach((update) => (req.user[update] = req.body[update]));
// // //     await req.user.save();
// // //     res.send(req.user);
// // //   } catch (error) {
// // //     res.status(400).send(error);
// // //   }
// // // };

// // // // Delete user profile
// // // const deleteAccount = async (req, res) => {
// // //   try {
// // //     await req.user.remove();
// // //     res.send(req.user);
// // //   } catch (error) {
// // //     res.status(500).send(error);
// // //   }
// // // };

// // // export { users, profile, deleteAccount, updateProfile };

// // // // // const express = require('express');
// // // // // const User = require('../models/user');
// // // // import express from "express";
// // // // import { getUsers } from "../models/User";

// // // // const router = express.Router();

// // // // // // Create a new user
// // // // // router.post('/register', async (req, res) => {
// // // // //     try {
// // // // //         const user = new User(req.body);
// // // // //         await user.save();
// // // // //         res.status(201).send(user);
// // // // //     } catch (error) {
// // // // //         res.status(400).send(error);
// // // // //     }
// // // // // });

// // // // // // Login a user
// // // // // router.post('/login', async (req, res) => {
// // // // //     try {
// // // // //         const user = await User.findByCredentials(req.body.email, req.body.password);
// // // // //         if (!user) {
// // // // //             return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
// // // // //         }
// // // // //         res.send({ user });
// // // // //     } catch (error) {
// // // // //         res.status(400).send(error);
// // // // //     }
// // // // // });

// // // // // Get user profile
// // // // router.get("/me", async (req, res) => {
// // // //   const users = await getUsers();
// // // //   res.status(200).send(users);
// // // // });

// // // // // Update user profile
// // // // router.patch("/me", async (req, res) => {
// // // //   const updates = Object.keys(req.body);
// // // //   const allowedUpdates = ["name", "email", "password"];
// // // //   const isValidOperation = updates.every((update) =>
// // // //     allowedUpdates.includes(update)
// // // //   );

// // // //   if (!isValidOperation) {
// // // //     return res.status(400).send({ error: "Invalid updates!" });
// // // //   }

// // // //   try {
// // // //     updates.forEach((update) => (req.user[update] = req.body[update]));
// // // //     await req.user.save();
// // // //     res.send(req.user);
// // // //   } catch (error) {
// // // //     res.status(400).send(error);
// // // //   }
// // // // });

// // // // // Delete user profile
// // // // router.delete("/me", async (req, res) => {
// // // //   try {
// // // //     await req.user.remove();
// // // //     res.send(req.user);
// // // //   } catch (error) {
// // // //     res.status(500).send(error);
// // // //   }
// // // // });

// // // // export default router;
