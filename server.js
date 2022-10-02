const mysql = require('mysql');
// const express = require('express');
const inquirer = require('inquirer');
require("console.table");
// const app = express();


// not sure if express is needed yet, keep this for now
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// connecting to mysql
const connection = mysql.createConnection({
    // host: 'localhost',
    // had issues with localhost connection
    host: '127.0.0.1',
    PORT: 5000,

    user: 'root',
    password: 'root',
    database: 'employee_trackerDB',
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });

//   main menu
function viewingChoice() {
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'menu',
                message: 'What would you like to do?',
                choices: [
                    `View All Employees`,
                    `Add Employee`,
                    `Update Employee Role`,
                    `View All Roles`,
                    `Add Role`,
                    `View All Departments`,
                    `Add Department`,
                    `Quit`
                ]
            }
        )

        .then(function ({ menu }) {
            switch (menu) {
                case 'View All Employees':
                    viewEmployees();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'View All Departments':
                    viewDepartment();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Quit':
                    process.exit();
                    

            }
        })

}

// shows table containing all employee info
function viewEmployees() {
    console.log('Viewing Employees\n');

    connection.query("SELECT emp.id, emp.first_name, emp.last_name, roles.title, roles.salary, department.name AS department, CONCAT(man.first_name, ' ', man.last_name) AS manager FROM employee emp LEFT JOIN employee man ON emp.manager_id=man.id LEFT JOIN roles ON emp.role_id=roles.id LEFT JOIN department ON roles.department_id=department.id", 
    (err, results) => {
      if (err) throw err;
      console.log('data recieved')
      console.table(results);
      
    });
    viewingChoice();
  };

//   adds new employee into set, need to figure out a way to go from integers to displaying actual names for ease
  const addEmployee = () => 
    inquirer.prompt([
     
        {
            type: 'input',
            name: 'empFirst',
            message: "Please enter the employee's first name",
        },
        {
            type: 'input',
            name: 'empLast',
            message: "Please enter the employee's last name",
        },
        {
            type: 'list',
            name: 'empRole',
            message: "What is the employee's role ID?",
            choices: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8
            ],
        },
        {
            type: 'list',
            name: 'empMan',
            message: "What is the employee's manager's ID?",
            choices: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
            ]
        }
    
    ])

    .then(answer => {
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.empFirst,
            last_name: answer.empLast,
            role_id: answer.empRole,
            manager_id: answer.empMan,
          },

          function(err, res) {
            if (err) throw err;
            console.log(
              `You have entered ${answer.empFirst} ${answer.empLast} into the employee database.`
            );
            viewingChoice();
          }
        );
      });
    
// const updateEmployeeRole = () =>
  
// shows table containing role title and associated salary
  function viewRoles() {
    console.log('Viewing Roles\n');

    connection.query("SELECT title, salary FROM roles", 
    (err, results) => {
      if (err) throw err;
      console.log('data recieved')
      console.table(results);
      
    });
    viewingChoice();

  }

//   const addRole = () =>


function viewDepartment() {
    console.log('Viewing Departments\n');
}



viewingChoice();

