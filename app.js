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
           'Update employee manager',
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
            case "Update employee manager":
                updateManager();
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
            if (res[i].name === answer.department) {
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

  const addEmployee = () => {
    const sql = `SELECT role.title, role.id FROM role`;
    db.query(sql, (err, res) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "choice",
            type: "list",
            message: "What is the role of this employee?",
            choices: () => {
              let choiceArray = [];
              for (let i = 0; i < res.length; i++) {
                choiceArray.push(`${res[i].title}`);
              }
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          let employeeRole = answer.choice;
          let role_id;
          for (let i = 0; i < res.length; i++) {
            if (res[i].title === answer.choice) {
              role_id = res[i].id;
            }
          }
          db.query(
            `INSERT INTO employee SET ?`,
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: role_id,
            },
            (err) => {
              if (err) throw err;
              console.log(
                `You have created an employee ${answer.first_name} ${answer.last_name} with a role of ${employeeRole}.`
              );
              prompt();
            }
          );
        });
    });
  };

  const updateRole = () => {
    sql = `SELECT employee.first_name, employee.last_name, role.salary, role.title, role.id, department.name as "Department Name"
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id `;
    db.query(sql, (err, res) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            name: "employeeChoice",
            type: "list",
            choices: () => {
              let choiceArray = [];
              for (let i = 0; i < res.length; i++) {
                choiceArray.push(`${res[i].first_name} ${res[i].last_name}`);
              }
              return choiceArray;
            },
            message: "Which employee do you want to change?",
          },
        ])
        .then((answer) => {
          const sql = `SELECT role.title, role.id, role.salary
        FROM role`;
          db.query(sql, (err, res) => {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: "roleChoice",
                  type: "list",
                  choices: function () {
                    let roleChoiceArray = [];
                    for (let i = 0; i < res.length; i++) {
                      roleChoiceArray.push(res[i].title);
                    }
                    return roleChoiceArray;
                  },
                  message: "Which role do you want to apply to the employee?",
                },
              ])
              .then((newanswer) => {
                // letiables for update
                let role_id, employeeId;
                const sql = `SELECT employee.first_name, employee.last_name, employee.id
              FROM employee`;
                // searching and matching for name
                db.query(sql, (err, res) => {
                  if (err) throw err;
                  for (let i = 0; i < res.length; i++) {
                    if (
                      `${res[i].first_name} ${res[i].last_name}` ===
                      answer.employeeChoice
                    ) {
                      employeeId = res[i].id;
                    }
                  }
                  // searching and matching for title
                  const sql = `SELECT role.title, role.salary, role.id
                  FROM role`;
                  db.query(sql, (err, res) => {
                    if (err) throw err;
  
                    for (let i = 0; i < res.length; i++) {
                      if (`${res[i].title}` === newanswer.roleChoice) {
                        role_id = res[i].id;
                      }
                    }
                    const sql = `UPDATE employee SET ? WHERE ?`;
                    const params = [{ role_id: role_id }, { id: employeeId }];
                    db.query(sql, params, (err) => {
                      if (err) throw err;
                      console.log("Employee's role has been changed.");
                      prompt();
                    });
                  });
                });
              });
          });
        });
    });
  };
 
  const updateManager = () => {
    sql = `SELECT employee.first_name, employee.last_name
    FROM employee`;
    db.query(sql, (err, res) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            name: "employeeChoice",
            type: "list",
            message: "Which employee do you want to change?",
            choices: () => {
              let choiceArray = [];
              for (let i = 0; i < res.length; i++) {
                choiceArray.push(`${res[i].first_name} ${res[i].last_name}`);
              }
              return choiceArray;
            },
          },
          {
            type: "input",
            name: "manager_id",
            message: "What manager would you like to assign to employee?"
  
          }
        ]).then((answer) => {
                // letiables for update
                let employeeId;
                const sql = `SELECT employee.first_name, employee.last_name, employee.id
              FROM employee`;
                // searching and matching for name
                db.query(sql, (err, res) => {
                  if (err) throw err;
                  for (let i = 0; i < res.length; i++) {
                    if ( `${res[i].first_name} ${res[i].last_name}` === answer.employeeChoice
                   ) {
                      employeeId = res[i].id;
                      manager_id = answer.manager_id
                    }
                  }
                    const sql = `UPDATE employee SET ? WHERE ?`;
                    const params = [{ manager_id: answer.manager_id }, { id: employeeId }];
                    db.query(sql, params, (err) => {
                      if (err) throw err;
                      console.log("Employee's manager has been changed.");
                      prompt();
                    });
                });
              });
          });
    };
  

prompt();