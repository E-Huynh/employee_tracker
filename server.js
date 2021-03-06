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
                'Delete',
                'Update'
            ]
    }])
        .then(function (response) {
            switch (response.action) {
                case 'View':
                    return viewChoice();
                case 'Add':
                    return addChoice();
                case 'Delete':
                    return deleteChoice();
                case 'Update':
                    return updateChoice();
                default:
                    console.log("Error: No option selected");
            }
        });
}
//View related functions
function allEmployees(runInit, cb) {
    connection.query(
        "SELECT e.id 'ID', e.first_name 'First Name', e.last_name 'Last name', department.role 'Department', positions.title 'Position', positions.salary 'Salary', CONCAT(f.first_name, ' ', f.last_name) AS 'Manager' FROM employee AS e left join employee AS f on e.manager_id = f.id INNER JOIN positions ON e.position_id = positions.id INNER JOIN department ON positions.department_id = department.id ORDER BY id;",
        function (err, result) {
            if (err) throw err;
            console.table(result);
            if (runInit === false) {
                console.log("\n");
                return cb();
            } else {
                init();
            }
        });
}
function allEmployeesDepartment(array) {
    inquirer.prompt([{
        type: 'list',
        name: 'department',
        message: "View all employees in which department?",
        choices: array
    }])
        .then(function (response) {
            connection.query(
                "SELECT e.id 'ID', e.first_name 'First Name', e.last_name 'Last name', department.role 'Department', positions.title 'Position', positions.salary 'Salary', CONCAT(f.first_name, ' ', f.last_name) AS 'Manager' FROM employee AS e left join employee AS f on e.manager_id = f.id INNER JOIN positions ON e.position_id = positions.id INNER JOIN department ON positions.department_id = department.id WHERE department.role = ? ORDER BY id;",
                [response.department],
                function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init();
                });
        }
        );
}
function allEmployeesManager(array) {
    inquirer.prompt([{
        type: 'list',
        name: 'manager',
        message: "View all employees by which manager?",
        choices: array
    }])
        .then(function (response) {
            let index = array.indexOf(response.manager);
            switch (index) {
                case 0:
                    connection.query(
                        "SELECT e.id 'ID', e.first_name 'First Name', e.last_name 'Last name', department.role 'Department', positions.title 'Position', positions.salary 'Salary', CONCAT(f.first_name, ' ', f.last_name) AS 'Manager' FROM employee AS e left join employee AS f on e.manager_id = f.id INNER JOIN positions ON e.position_id = positions.id INNER JOIN department ON positions.department_id = department.id WHERE e.manager_id IS NULL ORDER BY id;",
                        function (err, result) {
                            if (err) throw err;
                            console.table(result);
                            init();
                        });
                    break;
                default:
                    connection.query(
                        "SELECT e.id 'ID', e.first_name 'First Name', e.last_name 'Last name', department.role 'Department', positions.title 'Position', positions.salary 'Salary', CONCAT(f.first_name, ' ', f.last_name) AS 'Manager' FROM employee AS e left join employee AS f on e.manager_id = f.id INNER JOIN positions ON e.position_id = positions.id INNER JOIN department ON positions.department_id = department.id WHERE e.manager_id = ? ORDER BY id;",
                        [index],
                        function (err, result) {
                            if (err) throw err;
                            console.table(result);
                            init();
                        });
            }
        }
        );
}
//Add related functions
//Still needs dynamic choices
function addEmployee(array) {
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
            type: 'input',
            name: 'position_id',
            message: "What is the employee's position ID?",
            // choices: array
            //this needs to be dynamic
            // [
            //     1,
            //     2,
            //     3,
            //     4
            // ]
        },
        {
            type: 'input',
            name: 'manager_id',
            message: "Who is the employee's manager?",
            //this needs to be dynamic and a list
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
//Delete related functions
function deleteEmployee(array) {
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
        }
    ])
        .then(function (response) {
            // console.log(response);
            connection.query(
                "DELETE FROM employee WHERE first_name = ? and last_name = ?;",
                [response.first_name, response.last_name],
                function (err, result) {
                    console.log(`${response.first_name} ${response.last_name} was deleted.`)
                    if (err) throw err;
                    init();
                });
        }
        );
}
function deleteDepartment(array) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: "Which department would you like to delete?",
            choices: array
        }
    ])
        .then(function (response) {
            connection.query(
                "DELETE FROM department WHERE ?;",
                [response],
                function (err, result) {
                    if (err) throw err;
                    console.log(`${response.role} was deleted.`)
                    init();
                });
        }
        );
}
//cannot delete positions that are currently assigned due to foreign keys
function deletePosition(array) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'title',
            message: "What is the position you want to delete?",
            choices: array
        }
    ])
        .then(function (response) {
            connection.query(
                "DELETE FROM positions WHERE ?;",
                [response],
                function (err, result) {
                    if (err) throw err;
                    console.log(`${response.title} was deleted`);
                    init();
                });
        }
        );
}
//Update related functions
function updateEmployeePosition(array) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the first name of the employee you want to update?"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the first name of the employee you want to update?"
        },
        {
            type: 'list',
            name: 'position_id',
            message: "What is the employee's new position?",
            choices: array
        }
    ])
        .then(function (response) {
            connection.query(
                "SELECT id, title From positions;",
                function (err, result) {
                    if (err) throw err;
                    let choiceId;
                    let choice = result.filter(word => word.title === response.position_id);
                    choiceId = choice[0].id;
                    employeePositionCallback(choiceId, response.first_name, response.last_name);
                });
        }
        );
}
//These functions group similar functions together
function viewChoice() {
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
            switch (response.viewType) {
                case 'All Employees':
                    allEmployees(true);
                    break;
                case 'All Employees By Department':
                    distinctDepartment(allEmployeesDepartment);
                    break;
                case 'All Employees By Manager':
                    distinctManager();
                    break;
                default:
                    console.log("Error: No option selected");
            }
        });
}
function addChoice() {
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
            switch (response.addType) {
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
function deleteChoice() {
    inquirer.prompt([{
        type: 'list',
        name: 'deleteType',
        message: 'What would you like to delete?',
        choices:
            [
                'Employee',
                'Department',
                'Position'
            ]
    }])
        .then(function (response) {
            switch (response.deleteType) {
                case 'Employee':
                    allEmployees(false, deleteEmployee);
                    break;
                case 'Department':
                    distinctDepartment(deleteDepartment);
                    break;
                case 'Position':
                    distinctPosition(deletePosition)
                    // deletePosition();
                    break;
                default:
                    console.log("Error: No option selected");
            }
        });
}
function updateChoice() {
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
            switch (response.updateType) {
                case 'Employee Position':
                    distinctPosition(updateEmployeePosition);
                    break;
                case 'Employee Manager':
                    console.log('Fx does not exist');
                    break;
                default:
                    console.log("Error: No option selected");
            }
        });
}
//Functions to make some questions dynamically show choices
function distinctDepartment(cb) {
    let deptArray = [];
    connection.query(
        "SELECT DISTINCT role FROM department;",
        function (err, result) {
            if (err) throw err;
            result.forEach(element => deptArray.push(element.role));
            cb(deptArray)
        }
    )
}
function distinctManager() {
    let managerArray = ['No Manager'];
    connection.query(
        "SELECT distinct e.manager_id, CONCAT(f.first_name, ' ', f.last_name) AS 'Manager' FROM employee AS e left join employee AS f on e.manager_id = f.id;",
        function (err, result) {
            if (err) throw err;
            for (let i = 1; i < result.length; i++) {
                managerArray.push(result[i].Manager);
            }
            allEmployeesManager(managerArray)
        }
    )
}
function distinctPosition(cb) {
    let array = [];
    connection.query(
        "SELECT DISTINCT title FROM positions;",
        function (err, result) {
            if (err) throw err;
            result.forEach(element => array.push(element.title));
            cb(array)
        }
    )
}
function employeePositionCallback(id, first_name, last_name) {
    connection.query(
        "UPDATE employee SET position_id = ? WHERE first_name = ? AND last_name = ?;",
        [id, first_name, last_name],
        function (err, result) {
            if (err) throw err;
            init();
        });
}