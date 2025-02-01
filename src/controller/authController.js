import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { createUser, findUserByEmail } from "../models/User.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await findUserByEmail(email);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords (assuming passwords are hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Store user data in the session
    req.session.user = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      accessToken: token,
    };

    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password);
//   try {
//     const user = await findUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // console.log(user, "usersql");
//     const isMatch = await bcrypt.compare(password, user.password); // user.password_hash
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }
//     const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export { register, login };
