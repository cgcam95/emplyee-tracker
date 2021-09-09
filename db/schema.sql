DROP DATABASE IF EXISTS Employee_tracker;
CREATE DATABASE Employee_tracker;

-- use employee_tracker
USE Employee_tracker;

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- creating tables
CREATE TABLE department(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (

    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30)  NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY(role_id) REFERENCES role (id),
    manager_id INTEGER NULL,
    FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL
);