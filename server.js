const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employeelist_db",
});

db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the employeelist_db database.`);
});

module.exports = db;
