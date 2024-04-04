const express = require('express')
const client = require('../config/database');
const verifyToken = require('../middlewares/auth');
const router = express.Router()

router.get('/', (req, res) => {
    pool.query('SELECT * FROM Destinations', (err, result) => {
        if (err) {
            console.error('Error executing destinations query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(result.rows);
    });
});

router.post('/', verifyToken, (req, res) => {
    const { name, description, location, rating, image_url } = req.body;

    if (req.userRole !== 'admin') {
        return res.status(403).send('Access denied. Only admins can add destinations.');
    }

    client.query('INSERT INTO Destinations (name, description, location, rating, image_url) VALUES ($1, $2, $3, $4, $5)', [name, description, location, rating, image_url], (err) => {
        if (err) {
            console.error('Error executing add destination query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(201).send('Destination added successfully');
    });
});

module.exports = router