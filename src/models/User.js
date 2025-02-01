import pool from "../config/databases/db.js";

const getUsers = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const createUser = async (name, email, password) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    // console.log(rows, "at User.js");
    return rows[0]; // Return the first matching user
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

export { createUser, getUsers, findUserByEmail };
