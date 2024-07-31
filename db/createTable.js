const mysql = require('mysql');

const servername = "localhost";
const user = "jessmdeleon";
const pass = "password123";
const dbname = "jessmdeleon";

const conn = mysql.createConnection({
    host: servername,
    user: user,
    password: pass,
    database: dbname
});

conn.connect((err) => {
    if (err) {
        console.error("Could not connect to server");
        throw new Error("Connection failed: " + err.message);
    }

    const sql = `CREATE TABLE user_form (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_type VARCHAR(255) NOT NULL)`;

    conn.query(sql, (err, result) => {
        if (err) {
            console.error("Error creating table: " + err.message);
        } else {
            console.log("Table user_form created successfully");
        }
        conn.end();
    });
});

