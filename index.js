import dotenv from "dotenv";
// import app from "./app.js";
import server from "./server.js";
import pool from "./src/config/databases/db.js";

dotenv.config();

const PORT = process.env.PORT || 8081;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    // console.log("Connected to MySQL!");
    console.log(
      `CONNECTED_TO_MySQL_DB ${process.env.DB_NAME}! ON PORT ${process.env.DB_PORT}`
    );
    connection.release(); // Release the connection back to the pool
    // Start the server
    server.listen(PORT, () => {
      console.log(`SERVER_IS_RUNNING_ON_PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
  }
};

startServer();
