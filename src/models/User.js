import pool from "../config/databases/db.js";

const getUsers = async () => {
  const usersQuery = `SELECT * FROM userAccount`;
  try {
    const [rows] = await pool.query(usersQuery);
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const createUser = async (name, email, password) => {
  const createQuery = `INSERT INTO userAccount (username, email, password) VALUES (?, ?, ?) `;
  const createParams = [name, email, password];
  try {
    // const [result] = await pool.query(
    //   "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    //   [name, email, password]
    // );
    const [result] = await pool.query(createQuery, createParams);
    return result.insertId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const findUserByEmail = async (email) => {
  const checkQuery = `SELECT * FROM userAccount WHERE email =? `;
  const checkParams = [email];

  try {
    // const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    //   email,
    // ]);
    // console.log(rows, "at User.js");
    // return rows[0]; // Return the first matching user

    const [result] = await pool.query(checkQuery, checkParams);
    return result[0]; // Return the first matching user
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

export { createUser, getUsers, findUserByEmail };
