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
                'Remove Employee',
                'Update Employee Role',
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
                    console.log('Add Employee chosen');
                    break;
                case 'Remove Employee':
                    console.log('Remove Employees chosen');
                    break;
                case 'Update Employee Role':
                    console.log('Update Employee Role chosen');
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

