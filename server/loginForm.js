const express = require('express');
const crypto = require('crypto');
const conn = require('./config');

const router = express.Router();

router.post('/login', (req, res) => {
    const username = conn.escape(req.body.username);
    const pass = crypto.createHash('md5').update(req.body.password).digest('hex');

    const select = `SELECT * FROM user_form WHERE username = ${username} AND password = '${pass}'`;

    conn.query(select, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            const row = results[0];
            req.session.user = {
                username: row.username,
                user_type: row.user_type
            };
            res.redirect('/dashboard'); // Redirect to a dashboard page based on user_type
        } else {
            res.redirect('/login?error=Incorrect username or password');
        }
    });
});

module.exports = router;
