import { getUsers } from "../models/User.js";

const users = async (req, res) => {
  // const { rows } = await getUsers();
  const rows = await getUsers();
  res.status(200).send(rows);
};

const profile = async (req, res) => {
  const { rows } = await userPorfile(id);
  console.log(rows, " at profle");
  //   res.status(200).send(rows);
};

export { users, profile };

// // const express = require('express');
// // const User = require('../models/user');
// import express from "express";
// import { getUsers } from "../models/User";

// const router = express.Router();

// // // Create a new user
// // router.post('/register', async (req, res) => {
// //     try {
// //         const user = new User(req.body);
// //         await user.save();
// //         res.status(201).send(user);
// //     } catch (error) {
// //         res.status(400).send(error);
// //     }
// // });

// // // Login a user
// // router.post('/login', async (req, res) => {
// //     try {
// //         const user = await User.findByCredentials(req.body.email, req.body.password);
// //         if (!user) {
// //             return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
// //         }
// //         res.send({ user });
// //     } catch (error) {
// //         res.status(400).send(error);
// //     }
// // });

// // Get user profile
// router.get("/me", async (req, res) => {
//   const users = await getUsers();
//   res.status(200).send(users);
// });

// // Update user profile
// router.patch("/me", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "email", "password"];
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
// });

// // Delete user profile
// router.delete("/me", async (req, res) => {
//   try {
//     await req.user.remove();
//     res.send(req.user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// export default router;
