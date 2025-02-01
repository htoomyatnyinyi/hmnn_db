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

// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// // Create a connection pool
// const pool = mysql
//   .createPool({
//     host: process.env.DB_HOST || "localhost", // Use 'hmnn_db' if your backend is in another Docker container
//     user: process.env.DB_USER || "root", // MySQL username
//     password: process.env.DB_PASSWORD || "hmnn", // MySQL password
//     database: process.env.DB_NAME || "hmnn_db", // Database name
//     port: process.env.DB_PORT || 3308, // MySQL port
//     // waitForConnections: true,
//     // connectionLimit: 10,
//     // queueLimit: 0,
//     // max: process.env.DB_MAX_CONNECTIONS || 10, // Limit connection pool size
//     // idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000, // Close idle connections after 30s
//     // connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT || 5000, // Connection timeout
//     // ssl: process.env.DB_SSL_ENABLED === 'true' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined, // SSL configuration (important for production)
//   })
//   .promise();

// const testGetUser = async () => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM users");
//     // console.log(rows);
//     return rows;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw error;
//   }
// };

// export default pool;
