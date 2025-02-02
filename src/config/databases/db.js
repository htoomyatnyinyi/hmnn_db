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

  // waitForConnections: true,
  // connectionLimit: 10, // Adjust based on your needs
  // queueLimit: 0,
});

// Promisify the pool for easier async/await usage
const pool = sql_db.promise();

// Initialize Database
const initializeDatabase = async () => {
  try {
    console.log(`Connected to MySQL Database: ${process.env.DB_DATABASE}`);

    // Define all table creation queries
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS userAccount (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        gender ENUM('male', 'female', 'other', 'none'),
        date_of_birth DATE,
        location VARCHAR(255),
        verified BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT TRUE,
        bios TEXT,
        profile_img VARCHAR(255),
        cover_img VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS jobPost (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        salary DECIMAL(10,1) NOT NULL,
        location VARCHAR(255),
        address VARCHAR(255),
        company_name VARCHAR(255),
        license VARCHAR(100),
        category VARCHAR(255),
        company_logo VARCHAR(255),
        post_img VARCHAR(255),
        employmentType ENUM('Full-time', 'Part-time', 'Apprenticeship', 'OJT'),
        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS jobResponsibilities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        responsibility TEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES jobPost(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS jobRequirements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        requirement TEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES jobPost(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS userResume (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES userAccount(id),
        file_path VARCHAR(255),
        file_name VARCHAR(255),
        file_type VARCHAR(50),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS fileResume (
        id INT AUTO_INCREMENT PRIMARY KEY,
        personal_info JSON NOT NULL,
        summary TEXT,
        experience JSON NOT NULL,
        skills TEXT,
        education JSON NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS userAppliedJob (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        resume_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES userAccount(id),
        FOREIGN KEY (post_id) REFERENCES jobPost(id),
        FOREIGN KEY (resume_id) REFERENCES userResume(id),
        status ENUM('pending', 'interviewed', 'rejected', 'offered') NOT NULL DEFAULT 'pending',
        applied BOOLEAN DEFAULT TRUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS userSavedJob (
        save_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES userAccount(id),
        FOREIGN KEY (post_id) REFERENCES jobPost(id),
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
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
// initializeDatabase();

export default pool;

// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// // Create a connection pool
// const pool = mysql
//   .createPool({
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "hmnn",
//     database: process.env.DB_NAME || "hmnn_db",
//     port: process.env.DB_PORT || 3308,
//   })
//   .promise(); // Enable promise-based API

// // Test the connection
// const testConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("Connected to MySQL!");
//     connection.release(); // Release the connection back to the pool
//   } catch (err) {
//     console.error("Error connecting to MySQL:", err);
//   }
// };

// // Query the database using async/await
// const testGetUser = async () => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM users");
//     console.log("Users:", rows);
//     return rows;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw error;
//   }
// };

// // Test the connection and query
// // testConnection();
// // testGetUser();

// export default pool;
