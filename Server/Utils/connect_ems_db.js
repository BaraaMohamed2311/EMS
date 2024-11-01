// configuring dotenv to access variables
require('dotenv').config()

const mysql  = require('mysql2');

const connectionPool = mysql.createPool({
  host     :  process.env.DB_HOST,
  port     :  process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  connectionLimit: 10,
});



module.exports = connectionPool;