const inquirer = require('inquirer');
const mysql = require('mysql2');



const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '123456789',
    database: 'business_db'
  },
  console.log(`Connected to the business_db database.`)
);

const menu = [
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'menu',
    choices: ['view all departments', 'view all roles', 'add a department', 'view all employees', 'add a role', 'add an employee', 'update an employee role', 'exit']
  }
];


function init() {
  inquirer.prompt(menu).then(
    answers => {
      if (answers.menu === 'view all departments') {
        db.query('SELECT * FROM department', async function (err, results) {
          await console.table(results)
          init();
        });
      } else if (answers.menu === 'view all roles') {
        db.query('SELECT role.id, role.role, role.salary, department.name FROM role JOIN department ON role.department_id = department.id', async function (err, results) {
          await console.table(results)
          init();
        });
      } else if (answers.menu === 'view all employees') {
        db.query('SELECT employee.id, employee.first_name, employee.last_name, role.role FROM employee JOIN role ON employee.role_id = role.id', async function (err, results) {
          await console.table(results)
          init();
        })
      } else if (answers.menu === 'add a department') {
        inquirer.prompt([
          {
            type: 'input',
            message: 'What is the name of you deparment?',
            name: 'dept'
          }
        ]).then(
          answers => {
            db.query('INSERT INTO department (name) VALUES (?)', [answers.dep], function (err, results) {
              console.table(results);
            })
            init();
          }
        )
      } else if (answers.menu === 'add a role') {
        db.query('SELECT id AS value, name FROM department', function (err, results) {
          inquirer.prompt([
            {
              type: 'input',
              message: 'What is name of the role?',
              name: 'role'
            },
            {
              type: 'input',
              message: 'What is the salary of this role?',
              name: 'salary'
            },
            {
              type: 'list',
              choices: results,
              message: 'What department id does this role fall under?',
              name: 'department'
            }
          ]).then(
            answers => {
              db.query('INSERT INTO role (role, salary, department) VALUES (?, ?, ?)', [answers.role, answers.salary, answers.department], function (err, results) {
                console.table(results);

                init();
              })  
            })
        })

      } else if (answers.menu === 'add an employee') {
        db.query('SELECT id AS value, role AS name FROM role', function (err, results) {
          inquirer.prompt([
            {
              type: 'input',
              message: 'What is the first name?',
              name: 'first'
            },
            {
              type: 'input',
              message: 'What is the last name?',
              name: 'last'
            },
            {
              type: 'list',
              choices: results,
              message: 'what role does this employee fall under',
              name: 'role'
            }
          ]).then(
            answers => {

              db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [answers.first, answers.last, answers.role], function (err, results) {
                console.table(results)
                init();
              })
            })
        })
      } else if (answers.menu === 'update an employee role') {
        db.query('SELECT * FROM employee', function (err, employees)  {
          employees = employees.map((employee) => {
            return {
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            };
          });
          db.query('SELECT * FROM role', function (err, roles) {
            roles = roles.map((role) => {
              return {
                name: role.role,
                value: role.id,
              };
            })
        

          inquirer.prompt([
            {
              type: 'list',
              choices: employees,
              message: 'Which employee gets a role change today?',
              name: 'update'
            },
            {
              type: 'list',
              choices: roles,
              message: 'What is the employees new role?',
              name: 'updaterole',
            },
          ])
          .then((answers) => {
           db.query('UPDATE employee SET ? WHERE ?',
           [
            {
              role_id: answers.updaterole,
            },
            {
              id: answers.update,
            },
           ])
           init();
            }
          )
        });
      });
      } else {
       process.exit(0);
      };
    }

  )
}



init();