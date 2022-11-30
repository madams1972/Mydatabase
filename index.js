//Linking all requirements
const db = require("./connections/connections");
const ask = require("./utils/questions");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { updateEmployee } = require("./utils/questions");
const mysql = require("mysql2");


//starts program
init();

//gives user prompts and calls functions based on response
async function init() {
  try {
    const { initAnswer } = await inquirer.prompt(ask.initQuestions);

    switch (initAnswer) {
      case "View all departments":
        deptView();
        break;

      case "View all roles":
        roleView();
        break;

      case "View all employees":
        employeeView();
        break;

      case "Add a department":
        addDepartment();
        break;

      case "Add a role":
        addRole();
        break;

      case "Add an employee":
        addEmployee();
        break;

      case "Update employee role":
        updateEmpRole();
        break;

      case "Quit":
        process.exit();

      default:
        process.exit();
    }
  } catch (err) {
    console.log(err);
  }
}

//queries db for list of all departments
function deptView() {
  db.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
}

//queries db for list of all employee roles
function roleView() {
  db.query(
    `SELECT role.id, title, salary 
    FROM role 
    JOIN department ON role.department_id = department.id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    }
  );
}

//queries db for list of all employees
function employeeView() {
  db.query(
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employee AS e 
    JOIN role AS r ON e.role_id = r.id 
    JOIN department AS d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    }
  );
}

//prompts user to create new department then inserts into db
async function addDepartment() {
  const { deptName } = await inquirer.prompt(ask.addDeptQuestions);

  db.query("INSERT INTO department SET ?", { name: deptName }, function (err) {
    if (err) throw err;
    console.log("Department Succesfully Added!");
    init();
  });
}

//prompts user to create new role then inserts into db
function addRole() {
  db.query(`SELECT * FROM department`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    //creates array of all departments to be used withing inquirer prompt
    const depData = data.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    //collects input from user about new role and inserts it into the db
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the title of your new role?",
          name: "roleTitle",
        },
        {
          type: "input",
          message: "What is the salary for this role?",
          name: "roleSalary",
        },
        {
          type: "list",
          message: "What is the department for this role?",
          name: "roleDeptId",
          choices: depData,
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO role SET ?",
          {
            title: data.roleTitle,
            salary: data.roleSalary,
            department_id: data.roleDeptId,
          },
          function (err) {
            if (err) throw err;
            console.log("Role Succesfully Added!");
            init();
          }
        );
      });
  });
}

//collects input from user about new employee and inserts it into the db
async function addEmployee() {
  db.query(
    //queries database to get employee information to be used in creating list for manager selection within inquirer
    "SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee",
    async (err, employees) => {
      db.query(
        //queries database to get role information to be used in creating list for new employee's role selection within inquirer
        "SELECT id as value, title AS name FROM role",
        async (err, roles) => {
          //prompts user for information about new employee
          const newEmp = await inquirer.prompt(
            ask.addEmpQuestions(roles, employees)
          );
          //inserts new employee into db
          db.query("INSERT INTO employee SET ?", newEmp, function (err) {
            if (err) throw err;
            console.log("New employee was added successfully!");
            init();
          });
        }
      );
    }
  );
}

//collects input from user when changing employee's role
async function updateEmpRole() {
  db.query(
    //queries db to help create list of employees for user to select in inquirer
    `SELECT id AS value, CONCAT(first_name, ' ', last_name) as name FROM employee`,
    async (err, employees) => {
      db.query(
        //queries db to help create list of roles for user to select in inquirer
        `SELECT id AS value, title AS name FROM role`,
        async (err, roles) => {
          //prompts user for information
          const { newRole, employee } = await inquirer.prompt(
            ask.updateEmpQuestions(employees, roles)
          );
          db.query(
            //updates selected employee with new role
            "UPDATE employee SET ? WHERE ? ",
            [
              {
                role_id: newRole,
              },
              {
                id: employee,
              },
            ],
            function (err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " employees updated!\n");
              console.table(employee);
              init();
            }
          );
        }
      );
    }
  );
}
