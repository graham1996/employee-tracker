const mysql = require('mysql');
const inquirer = require('inquirer');
require("console.table");

// connecting to mysql
const connection = mysql.createConnection({
    // host: 'localhost',
    // having issues with localhost connection
    host: '127.0.0.1',
    PORT: 5000,

    user: 'root',
    password: 'root',
    database: 'employee_trackerDB',
});

connection.connect(function (err) {
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
            console.log('\ndata recieved\n')
            console.table(results);

        });
    viewingChoice();
};

//   adds new employee into set, need to figure out syntax to go from id integers to displaying actual names for ease
function addEmployee() {

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
            type: 'input',
            name: 'empRole',
            message: "What is the employee's role ID?",
        },
        {
            type: 'input',
            name: 'empMan',
            message: "What is the employee's manager's ID?",
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
    
                function (err, res) {
                    if (err) throw err;
                    console.log(
                        `\nYou have entered ${answer.empFirst} ${answer.empLast} into the employee database.\n`
                    );
                    viewingChoice();
                }
            );
        });
   
    };

// couldn't get const = () => function to work here? come back and change if when/possible
// changes role for selected employee
function updateEmployeeRole() {
    connection.query('SELECT * from roles', function (err, results) {
        if (err) throw err;

        const roleResults = results.map(function (newEmpRole) {
            return { name: newEmpRole.title, value: newEmpRole.id }
        })

        connection.query('SELECT * from employee', function (err, empResults) {
            if (err) throw err;
            const listEmpName = empResults.map(function (empName) {
                let fullName = empName.first_name + " " + empName.last_name
                return { name: fullName, value: empName.id };
            })

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'newEmpRole',
                    message: "Please select employee who's role you wish to update",
                    choices: listEmpName,
                },
                {
                    type: 'list',
                    name: 'changeRole',
                    message: "Please select the role you wish to assign",
                    choices: roleResults
                }
            ])

                .then((response) => {
                    console.log('You have updated employee role');

                    const roleUpdate = "UPDATE employee SET role_id = ? WHERE id =?"

                    connection.query(roleUpdate, [response.changeRole, response.newEmpRole],
                        function (err, results) {
                            if (err) throw err;
                            console.log(response.newEmpRole + " has been updated");
                        });
                    viewingChoice();
                })

        })

    })
}
// shows table containing role title and associated salary + id
function viewRoles() {
    console.log('Viewing Roles\n');

    connection.query("SELECT id, title, salary, department_id FROM roles",
        (err, results) => {
            if (err) throw err;
            console.log('data recieved')
            console.table(results);

        });
    viewingChoice();

};

// need to get list of options for department by name instead of numbers so added departments also show
// add new role into roles table
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newRole',
            message: "Please enter the new role name"
        },
        {
            type: 'input',
            name: 'roleDept',
            message: "Please enter the new role's department ID",
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: "What is the salary for this role?",
        },

    ])
        .then(answer => {
            connection.query(
                'INSERT INTO roles SET ?',
                {
                    title: answer.newRole,
                    department_id: answer.roleDept,
                    salary: answer.roleSalary,
                },

                function (err, res) {
                    if (err) throw err;
                    console.log(
                        `\nAdded ${answer.newRole} into the roles database.\n`
                    );
                    viewingChoice();
                }
            );
        });
}

// shows all departments
function viewDepartment() {
    console.log('Viewing Departments\n');

    connection.query("SELECT id, name FROM department",
        (err, results) => {
            if (err) throw err;
            console.log('data received')
            console.table(results);
        });
    viewingChoice();
};

// adds new department into department table
const addDepartment = () =>
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDept',
            message: "Please enter the new department's name"
        }
    ])
        .then(answer => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    name: answer.newDept,
                },

                function (err, res) {
                    if (err) throw err;
                    console.log(
                        `\nAdded ${answer.newDept} into the department database.\n`
                    );
                    viewingChoice();
                }
            );
        });

viewingChoice();


