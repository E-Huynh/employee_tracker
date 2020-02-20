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

//Starts prompts
function init() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: "What would you like to do?",
        choices:
            [
                'View',
                'Add',
                'Update'
            ]
    }])
        .then(function (response) {
            switch (response.action) {
                case 'View':
                    return viewChoice();
                case 'Add':
                    return addChoice();
                case 'Update':
                    return updateChoice();
                default:
                    console.log("Error: No option selected");
            }
        });
}
//View related functions
function allEmployees() {
    connection.query(
        //need to return manager as a column
        "SELECT e.id, e.first_name 'First Name', e.last_name 'Last name', department.role 'Role', positions.title 'Position', positions.salary 'Salary', CONCAT(f.first_name, ' ', f.last_name) AS 'Manager' FROM employee AS e left join employee AS f on e.manager_id = f.id INNER JOIN positions ON e.position_id = positions.id INNER JOIN department ON positions.department_id = department.id ORDER BY id;",
        function (err, result) {
            if (err) throw err;
            console.table(result);
            init();
        });
}
function allEmployeesDepartment(array) {
    inquirer.prompt([{
        type: 'list',
        name: 'department',
        message: "View all employees by which department?",
        choices: array
    }])
        .then(function (response) {
            connection.query(
                "SELECT e.id, e.first_name 'First Name', e.last_name 'Last name', department.role 'Role', positions.title 'Position', positions.salary 'Salary', CONCAT(f.first_name, ' ', f.last_name) AS 'Manager' FROM employee AS e left join employee AS f on e.manager_id = f.id INNER JOIN positions ON e.position_id = positions.id INNER JOIN department ON positions.department_id = department.id WHERE department.role = ? ORDER BY id;",
                [response.department],
                function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init();
                });
        }
        );
}
//REFORMAT TABLE
function allEmployeesManager() {
    inquirer.prompt([{
        type: 'input',
        name: 'manager',
        message: "View all employees by which manager's ID?",
    }])
        .then(function (response) {
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
//Add related functions
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
//Update related functions
function updateEmployeePosition() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: "What is the ID of the employee to update?"
        },
        {
            type: 'input',
            name: 'position_id',
            message: "What is the employee's new position?",
        }
    ])
    .then(function (response) {
        connection.query(
            "UPDATE employee SET position_id = ? WHERE id = ?;",
            [response.position_id, response.id],
            function (err, result) {
                if (err) throw err;
                init();
            });
    }
    );
}
//These functions group similar functions together
function viewChoice(){
    inquirer.prompt([{
        type: 'list',
        name: 'viewType',
        message: 'What would you like to view?',
        choices: 
            [
                'All Employees',
                'All Employees By Department',
                'All Employees By Manager'
            ]
    }])
    .then(function (response) {
        switch(response.viewType){
            case 'All Employees':
                allEmployees();
                break;
            case 'All Employees By Department':
                // allEmployeesDepartment();
                distinctDepartment()
                break;
            case 'All Employees By Manager':
                allEmployeesManager();
                break;
            default:
                console.log("Error: No option selected");
        }
    });
}
function addChoice(){
    inquirer.prompt([{
        type: 'list',
        name: 'addType',
        message: 'What would you like to add?',
        choices: 
            [
                'Employee',
                'Department',
                'Position'
            ]
    }])
    .then(function (response) {
        switch(response.addType){
            case 'Employee':
                addEmployee();
                break;
            case 'Department':
                addDepartment()
                break;
            case 'Position':
                addPosition();
                break;
            default:
                console.log("Error: No option selected");
        }
    });
}
function updateChoice(){
    inquirer.prompt([{
        type: 'list',
        name: 'updateType',
        message: 'What would you like to update?',
        choices: 
            [
                'Employee Position',
                'Employee Manager'
            ]
    }])
    .then(function (response) {
        switch(response.updateType){
            case 'Employee Position':
                updateEmployeePosition();
                break;
            case 'Employee Manager':
                console.lof('Fx does not exist');
                break;
            default:
                console.log("Error: No option selected");
        }
    });
}
function distinctDepartment(){
    let deptArray = [];
    connection.query(
        "SELECT DISTINCT role FROM department;",
        function(err, result){
            if(err) throw err;
            result.forEach(element => deptArray.push(element.role));
            allEmployeesDepartment(deptArray)
        }
    )
}
