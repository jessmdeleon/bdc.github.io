import express from 'express';
import session from 'express-session';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));


app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

app.post('/login', (req, res) => {
    if (req.body.submit) {
        const username = connection.escape(req.body.username);
        const pass = crypto.createHash('md5').update(req.body.password).digest('hex');
        const select = `SELECT * FROM user_form WHERE username = ${username} AND password = '${pass}'`;

        connection.query(select, (error, results) => {
            if (error) throw error;

            if (results.length > 0) {
                const row = results[0];

                if (row.user_type === 'admin') {
                    req.session.admin_name = row.username;
                    res.redirect('admin_dashboard.html');
                } else if (row.user_type === 'buyer') {
                    req.session.buyer_name = row.username;
                    res.redirect('buyer_dashboard.html');
                } else if (row.user_type === 'seller') {
                    req.session.seller_name = row.username;
                    res.redirect('seller_dashboard.html');
                }
            } else {
                const errorMsg = 'incorrect email or password!';
                res.render('login', { error: errorMsg });
            }
        });
    }
});

app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>login</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <div class="form-container">
                <form action="/login" method="post">
                    <h3>login now</h3>
                    ${req.query.error ? `<span class="error-msg">${req.query.error}</span>` : ''}
                    <input type="text" name="username" required placeholder="enter your username">
                    <input type="password" name="password" required placeholder="enter your password">
                    <input type="submit" name="submit" value="login now" class="form-button">
                    <a href="registrationform.html">sign up</a>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
