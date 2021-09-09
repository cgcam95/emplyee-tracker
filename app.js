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
        console.log(answers);
        prompt()
    })
}

