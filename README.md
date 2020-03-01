# CLI Employee Tracker

[Github Repo](https://github.com/E-Huynh/employee_tracker)

## Contact

Erik.W.Huynh@Gmail.com

[LinkedIn](https://www.linkedin.com/in/erik-huynh-228321196/)

[Portfolio](https://e-huynh.github.io/updated_portfolio/)

## Project Description
Employee tracker is a command line interface application that allows users to track employees in a SQL database. Users are able to enter in different departments, positions, salaries, managers and more using the interface. 
## Functionality
User are able to add/delete/view employees through the interface and change various database values. The interface is dynamic in regards to automatically populating choices based on the data in the database. 
## Installation
Copy the files to your local storage and use the database.SQL to create a the database. Run NPM install to prep all dependencies.
## Instructions
Simple run node server.js in the node terminal to run. Follow the CLI instructions to manipulate and interact with the application.
  
## Techonologies
  * [Express](https://expressjs.com/)
  * MySQL
  * [Inquirer](https://www.npmjs.com/package/inquirer)
## Known bugs
  * Current users cannot delete a department if a employee is assigned to that department. The application will crash and need to be restarted.
  * Adding an employee prompts the user to enter a position ID and manager ID instead of populating a list. 
  * Adding a position prompts the user to enter a department, this value must be entered as an ID instead of populating a list.
  
## Challenges & Accomplishments
The most challenging and rewarding part of this excercise was dealing with the asynchronous SQL queries. Learning to handle callbacks was a really fun challenge. I would really like to go back and reformat the functions into an ORM format to reduce "WET" code.
## Images
The menu allows a user to select between: View, Add, Delete, and Update.
![Menu](https://github.com/E-Huynh/employee_tracker/blob/master/Assets/Menu.png?raw=true)

Each menu choice has a submenu similar to the image below to allow a user to choose a more specific action.
![Submenu](https://github.com/E-Huynh/employee_tracker/blob/master/Assets/Submenu.png?raw=true)

Users can view the following: All Employees, All Employees by Department, and All Employees by Managers
![View Employees](https://github.com/E-Huynh/employee_tracker/blob/master/Assets/View%20Employees.png?raw=true)

Below is an example of viewing employees by department. The data is showing employees in the Management department. The second table shows employees in the Player department.
![View by Department](https://github.com/E-Huynh/employee_tracker/blob/master/Assets/View%20by%20Department.png?raw=true)

The add function allows users to add employees, departments, and positions.
![Add Submenu](https://github.com/E-Huynh/employee_tracker/blob/master/Assets/Add%20submenu.png?raw=true)

This is an example of the add employee function. The employee Github Example was added in this case.
![Add Employee](https://github.com/E-Huynh/employee_tracker/blob/master/Assets/Adding%20employee.png?raw=true)

This is an example of deleting an emplyee by typing in their first name and last name. Github Example was deleted in this case.
![Delete Employee](https://github.com/E-Huynh/employee_tracker/blob/master/Assets/Delete%20Employee.png?raw=true)

Employee's manager and position can be updated as well. In this example, the employee David Ayres was updated from Emergency Goalie to Coach.
![Update Employee](https://github.com/E-Huynh/employee_tracker/blob/master/Assets/Updating%20employee%20position.png?raw=true)

