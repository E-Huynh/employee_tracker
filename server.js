//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db"
});

// Initiate MySQL Connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

//Function calls
init();

//Functions
function init() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: "What would you like to do?",
        choices:
            [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Add Department',
                'Add Position',
                'Update Employee Manager'
            ]
    }])
        .then(function (response) {
            // based on their answer, either call the bid or the post functions
            switch (response.action) {
                case 'View All Employees':
                    allEmployees();
                    break;
                case 'View All Employees By Department':
                    allEmployeesDepartment();
                    break;
                case 'View All Employees By Manager':
                    allEmployeesManager()
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Position':
                    addPosition();
                    break;
                case 'Update Employee Manager':
                    console.log('Update Employee Manager chosen');
                    break;
                default:
                    console.log("Error: No option selected");
            }
        });
}

function allEmployees() {
    connection.query(
        //need to return manager as a column
        "SELECT employee.id, employee.first_name, employee.last_name, positions.title, department.role, positions.salary, employee.manager_id FROM employee INNER JOIN positions ON employee.position_id = positions.id INNER JOIN department ON positions.department_id = department.id;",
        function (err, result) {
            if (err) throw err;
            console.table(result);
            init();
        });
}
function allEmployeesDepartment() {
    inquirer.prompt([{
        type: 'list',
        name: 'department',
        message: "View all employees by which department?",
        choices:
            [
                'Management',
                'Player'
            ]
    }])
        .then(function (response) {
            connection.query(
                "SELECT employee.id, employee.first_name, employee.last_name, positions.title, department.role, positions.salary, employee.manager_id FROM employee INNER JOIN positions ON employee.position_id = positions.id INNER JOIN department ON positions.department_id = department.id WHERE department.role = ?;",
                [response.department],
                function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init();
                });
        }
        );
}
function allEmployeesManager() {
    inquirer.prompt([{
        type: 'input',
        name: 'manager',
        message: "View all employees by which manager's ID?",
    }])
        .then(function (response) {
            console.log(response);
            connection.query(
                "SELECT employee.id, employee.first_name, employee.last_name, positions.title, department.role, positions.salary, employee.manager_id FROM employee INNER JOIN positions ON employee.position_id = positions.id INNER JOIN department ON positions.department_id = department.id WHERE employee.manager_id = ?;",
                [response.manager],
                function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init();
                });
        }
        );
}
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
        },
        {
            type: 'list',
            name: 'position_id',
            message: "What is the employee's position?",
            choices:
            [
                1,
                2,
                3,
                4
            ]
        },
        {
            type: 'input',
            name: 'manager_id',
            message: "Who is the employee's manager?",
        },
    ])
    .then(function (response) {
        connection.query(
            "INSERT INTO employee SET ?;",
            [response],
            function (err, result) {
                if (err) throw err;
                init();
            });
    }
    );
}
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "What is the department name?",
        }
    ])
    .then(function (response) {
        connection.query(
            "INSERT INTO department SET ?;",
            [response],
            function (err, result) {
                if (err) throw err;
                init();
            });
    }
    );
}
function addPosition() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the position's name?",
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the position's salary?",
        },
        {
            type: 'input',
            name: 'department_id',
            message: "What is the position's department?",
        }
    ])
    .then(function (response) {
        connection.query(
            "INSERT INTO positions SET ?;",
            [response],
            function (err, result) {
                if (err) throw err;
                init();
            });
    }
    );
}