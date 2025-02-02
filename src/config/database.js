import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool
const sql_db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "hmnn",
  database: process.env.DB_NAME || "hmnn_db",
  port: process.env.DB_PORT || 3308,
});

// Promisify the pool for easier async/await usage
const pool = sql_db.promise();

// Initialize Database
const initializeDatabase = async () => {
  try {
    console.log(`Connected to MySQL Database: ${process.env.DB_DATABASE}`);

    // Define all table creation queries
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS userAccount (...)`,
      `CREATE TABLE IF NOT EXISTS jobPost (...)`,
      `CREATE TABLE IF NOT EXISTS jobResponsibilities (...)`,
      `CREATE TABLE IF NOT EXISTS jobRequirements (...)`,
      `CREATE TABLE IF NOT EXISTS userResume (...)`,
      `CREATE TABLE IF NOT EXISTS fileResume (...)`,
      `CREATE TABLE IF NOT EXISTS userAppliedJob (...)`,
      `CREATE TABLE IF NOT EXISTS userSavedJob (...)`,
    ];

    // Execute all table creation queries
    for (const query of tableQueries) {
      await pool.execute(query);
    }

    console.log("All tables created or verified successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Call the function to initialize the database
initializeDatabase();

export default pool;
