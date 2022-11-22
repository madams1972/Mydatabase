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
    choices: ['view all departments', 'view all titles', 'add a department', 'view all employees', 'add a title', 'add an employee', 'update an employee title', 'exit']
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
      } else if (answers.menu === 'view all titles') {
        db.query('SELECT title.id, title.title, title.salary, department.name FROM title JOIN department ON title.department_id = department.id', async function (err, results) {
          await console.table(results)
          init();
        });
      } else if (answers.menu === 'view all employees') {
        db.query('SELECT employee.id, employee.first_name, employee.last_name, title.title FROM employee JOIN title ON employee.title_id = title.id', async function (err, results) {
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
      } else if (answers.menu === 'add a title') {
        db.query('SELECT id AS value, name FROM department', function (err, results) {
          inquirer.prompt([
            {
              type: 'input',
              message: 'What is name of the title?',
              name: 'title'
            },
            {
              type: 'input',
              message: 'What is the salary of this title?',
              name: 'salary'
            },
            {
              type: 'list',
              choices: results,
              message: 'What department id does this title fall under?',
              name: 'department'
            }
          ]).then(
            answers => {
              db.query('INSERT INTO title (title, salary, department) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.department], function (err, results) {
                console.table(results);

                init();
              })  
            })
        })

      } else if (answers.menu === 'add an employee') {
        db.query('SELECT id AS value, title AS name FROM title', function (err, results) {
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
              message: 'what title does this employee fall under',
              name: 'title'
            }
          ]).then(
            answers => {

              db.query('INSERT INTO employee (first_name, last_name, title_id) VALUES (?, ?, ?)', [answers.first, answers.last, answers.title], function (err, results) {
                console.table(results)
                init();
              })
            })
        })
      } else if (answers.menu === 'update an employee title') {
        db.query('SELECT * FROM employee', function (err, employees)  {
          employees = employees.map((employee) => {
            return {
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            };
          });
          db.query('SELECT * FROM title', function (err, titles) {
            titles = titles.map((title) => {
              return {
                name: title.title,
                value: title.id,
              };
            })
        

          inquirer.prompt([
            {
              type: 'list',
              choices: employees,
              message: 'Which employee gets a title change today?',
              name: 'update'
            },
            {
              type: 'list',
              choices: titles,
              message: 'What is the employees new title?',
              name: 'updatetitle',
            },
          ])
          .then((answers) => {
           db.query('UPDATE employee SET ? WHERE ?',
           [
            {
              title_id: answers.updatetitle,
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