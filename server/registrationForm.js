const express = require('express');
const crypto = require('crypto');
const conn = require('./config');

const router = express.Router();

router.post('/register', (req, res) => {
    const username = conn.escape(req.body.username);
    const pass = crypto.createHash('md5').update(req.body.password).digest('hex');
    const cpass = crypto.createHash('md5').update(req.body.cpassword).digest('hex');
    const user_type = req.body.user_type;

    if (pass !== cpass) {
        return res.redirect('/register?error=Passwords do not match');
    }

    const select = `SELECT * FROM user_form WHERE username = ${username}`;
    conn.query(select, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            res.redirect('/register?error=User already exists');
        } else {
            const insert = `INSERT INTO user_form (username, password, user_type) VALUES (${username}, '${pass}', '${user_type}')`;
            conn.query(insert, (error) => {
                if (error) throw error;
                res.redirect('/login');
            });
        }
    });
});

module.exports = router;
