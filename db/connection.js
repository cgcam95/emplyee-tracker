const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Sports!182',
      database: 'employee_tracker'
    },
    console.log('Connected to the employee tracker database.')
  );

  module.exports = db;