//centralized list of question used by inquirer in app.js
const inquirer = require("inquirer");
const db = require("../connections/server.js");

module.exports = {
  initQuestions: {
    type: "list",
    message: "What would you like to do?",
    name: "initAnswer",
    choices: [
      "View all departments",
      "View all role",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update employee role",
      "Quit",
    ],
  },

  addDeptQuestions: {
    type: "input",
    message: "What is the name of your department?",
    name: "deptName",
  },

  addEmpQuestions: (role, employees) => [
    {
      type: "input",
      message: "What is your employee's first name?",
      name: "first_name",
    },
    {
      type: "input",
      message: "What is your employee's last name?",
      name: "last_name",
    },
    {
      type: "list",
      message: "What is your employee's role ID?",
      name: "role_id",
      choices: role,
    },
    {
      type: "list",
      message: "Who is your employee's manager?",
      name: "manager_id",
      choices: employees,
    },
  ],
  updateEmpQuestions: (employees, role) => [
    {
      type: "list",
      message: "Choose an employee to update:",
      name: "employee",
      choices: employees,
     
    },
    {
      type: "list",
      message: "What is this employee's new role?",
      name: "newrole",
      choices: role,
    },
  ],
};
