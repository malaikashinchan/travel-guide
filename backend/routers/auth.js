const express = require('express')
const router = express.Router()
const client = require('../config/database')
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/auth');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Users WHERE username = $1 AND password = $2'
    const values = [username, password]
    client.query(query, values, (err, result) => {
        if (err) {
            console.error('Error executing login query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (result.rows.length === 0) {
            res.status(401).send('Invalid username or password');
            return;
        }
        const token = jwt.sign({ userId: result.rows[0].user_id, role: result.rows[0].role }, 'secret');
        res.status(201).send(token);
    });
});

router.post('/signup', (req, res) => {
    const { username, email, password, role } = req.body;
    client.query('SELECT * FROM Users WHERE email = $1', [email], (err, result) => {
        if (err) {
            console.error('Error executing email check query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (result.rows.length > 0) {
            res.status(400).send('Email is already taken');
            return;
        }

        const insertQuery = 'INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id';
        client.query(insertQuery, [username, email, password, role], (err, result) => {
            if (err) {
                console.error('Error executing signup query: ', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            const token = jwt.sign({ userId: result.rows[0].user_id, role: role }, 'secret');
            res.status(201).send(token);
        });
    });
});

router.get('/profile', verifyToken, (req, res) => {
    const userId = req.userId;
    console.log(userId)
    client.query('SELECT * FROM Users WHERE user_id = $1', [userId], (err, result) => {
        if (err) {
            console.error('Error executing profile query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (result.rows.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.json(result.rows[0]);
    });
});

router.put('/profile', verifyToken, (req, res) => {
    const userId = req.userId;
    const { username, email } = req.body;
    client.query('UPDATE Users SET username = $1, email = $2 WHERE user_id = $3', [username, email, userId], (err) => {
        if (err) {
            console.error('Error executing profile update query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('Profile updated successfully');
    });
});

module.exports = router 