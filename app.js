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
           'view all employees',
           'Add a Department',
           'Add a Role',
           'Add an Employee',
           'Update an employee role',
           'Exit'
       ],
    },
];

const prompt = () => {
    inquirer.prompt(employeeMenuOptions)
    .then((answers) => {
        switch (answers.selection) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View all Roles":
                viewAllRoles();
                break;
            case "view All Employees":
                viewAllEmployees();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
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
      mainPrompt();
    });
  };

prompt();

