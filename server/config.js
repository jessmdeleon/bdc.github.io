const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'jessmdeleon',
  password: 'password123',
  database: 'jessmdeleon'
});

module.exports = conn;
