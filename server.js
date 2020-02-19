//Dependencies
const inquirer = require("inquirer");

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
        switch(response.action) {
            case 'View All Employees':
              console.log('View All Employees chosen');
              break;
            case 'View All Employees By Department':
              console.log('View All Employees By Department chosen');
              break;
            case 'View All Employees By Manager':
              console.log('View All Employees By Manager chosen');
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