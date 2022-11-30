const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Scrappy2020!",
  database: "employee_db",
});

db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the employee_db database.`);
});

module.exports = db;
