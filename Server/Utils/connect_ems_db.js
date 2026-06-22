// db.js
const mysql = require('mysql2');

let connectionPool;

function getConnectionPool() {
  if (!connectionPool) {
    if (!process.env.DB_HOST) {
      throw new Error("DB env variables are not loaded yet!");
    }

    connectionPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 25,
      waitForConnections: true,
      enableKeepAlive: true,
      idleTimeout: 60000,             // to fix reusing a dead MySQL connection from the pool. drop the connection after 60 seconds of inactivity
      keepAliveInitialDelay: 0,
    });

    console.log("MySQL pool created for host:", process.env.DB_HOST);
  }

  return connectionPool;
}

module.exports = { getConnectionPool };