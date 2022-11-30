const mysql = require("mysql2");
const fs = require("fs")
const bcrypt = require("bcryptjs")

// Load .env variables
require("dotenv").config()

// Read SQL seed query
const seedQuery = fs.readFileSync("db/seed.sql", {
  encoding: "utf-8",
})


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});
connection.query(seedQuery, [hash], err => {
  if (err) {
    throw err
  }questions
db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the employee_db database.`);
});

module.exports = db;
