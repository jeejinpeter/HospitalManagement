const mysql = require("mysql2");

const pool = mysql.createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 10,
});
// we can maintain the pool connection. we don't need to reconnect to DB each time

module.exports = pool;
