const mysql = require("mysql2");



const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Scrappy2020!",
  database: "employees_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the employees_db database.`);
});

module.exports = connection;
