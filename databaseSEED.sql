DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  role VARCHAR(30) NULL,
  PRIMARY KEY (id)
);
CREATE TABLE positions (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id),
  PRIMARY KEY (id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  position_id INT,
  manager_id INT DEFAULT NULL,
  FOREIGN KEY (position_id) REFERENCES positions(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  PRIMARY KEY (id)
);

INSERT INTO department (role)
VALUES ('Management'), ('Player');

INSERT INTO positions (title, salary, department_id)
VALUES ('Coach', 2000000, 1), ('Forward', 7500000, 2), ('Defensemen', 500000, 2), ('Goalie', 1000000, 2);

INSERT INTO employee (first_name, last_name, position_id, manager_id)
VALUES ('Rod', "Brind'amour", 1, null), ('Sebastian', 'Aho', 2, 1), ('Tuevo', 'Teravainen', 2, 1), ('Andrei', 'Svechnikov', 2, 1), ('Jacob', 'Slavin', 3, 1), ('Dougie', 'Hamilton', 3, 1), ('Petr', 'Mrazek', 4, 1);