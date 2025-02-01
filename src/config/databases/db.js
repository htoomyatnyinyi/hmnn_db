import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool
const pool = mysql
  .createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "hmnn",
    database: process.env.DB_NAME || "hmnn_db",
    port: process.env.DB_PORT || 3308,
  })
  .promise(); // Enable promise-based API

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL!");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
  }
};

// Query the database using async/await
const testGetUser = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    console.log("Users:", rows);
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Test the connection and query
// testConnection();
// testGetUser();

export default pool;
