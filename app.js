const inquirer = require('inquirer');
const db = require('./db/connection');

const employeeMenuOptions = [
    {
       type: 'list',
       name: 'selection',
       message: 'What would you like to select?',
       choices: [
           'View all departments',
           'View all roles',
           'View all employees',
           'Add a department',
           'Add a role',
           'Add an employee',
           'Update an employee role',
           'Exit'
       ],
    },
];

const prompt = () => {
    inquirer.prompt(employeeMenuOptions)
    .then((answers) => {
        switch (answers.selection) {
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View all employees":
                viewAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateRole();
                break;
            case "Exit":
                db.end();
                break;
        }
    });
};

const viewAllDepartments = (req, res) => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
      if (err) throw err;
  
      console.table(res);
      prompt();
    });
  };

  const viewAllRoles = (req, res) => {
    const sql = `SELECT role.id, role.title, role.salary, department.name AS "Department" 
    FROM role
    INNER JOIN department ON role.department_id = department_id`;
    db.query(sql, (err, res) => {
      if (err) throw err;
  
      console.table(res);
      prompt();
    });
  };

  const viewAllEmployees = (req, res) => {
    const sql = `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name", Manager.first_name AS "Manager"
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee Manager ON employee.manager_id = Manager.id`;
    db.query(sql, (err, res) => {
      if (err) throw err;
  
      console.table(res);
      prompt();
    });
  };

  const addDepartment = () => {
    inquirer
      .prompt([
        { name: "name", type: "input", message: "What is the department name?" },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO department SET ?`,
          {
            name: answer.name,
          },
          (err) => {
            if (err) throw err;
            prompt();
          }
        );
      });
  };

  const addRole = () => {
    const sql = `SELECT department.name, department.id
    FROM department`;
    db.query(sql, (err, res) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "What is the name of the role?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?",
          },
          {
            name: "department",
            type: "list",
            message: "What is the department for this role?",
            choices: () => {
              let departmentArray = [];
              for (let i = 0; i < res.length; i++) {
                departmentArray.push(res[i].name);
              }
              return departmentArray;
            },
          },
        ])
        .then((answer) => {
  
          let dept = answer.choice;
          let department_id;
          for (let i = 0; i < res.length; i++) {
            if (res[i].name === answer.choice) {
              department_id = res[i].id;
            }
          }
          db.query(
            `INSERT INTO role SET ?`,
            {
              title: answer.title,
              salary: answer.salary,
              department_id: department_id,
            },
            (err) => {
              if (err) throw err;
              console.log(
                `You have created ${answer.title} with salary of ${answer.salary} in ${dept}.`
              );
              prompt();
            }
          );
        });
    });
  };

prompt();