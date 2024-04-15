const express = require('express')
const router = express.Router()
const client = require('../config/database')
const verifyToken = require('../middlewares/auth');

router.post('/', verifyToken, async (req, res) => {
    console.log(req.body)
    try { 
        const { name, location, description, rating, image_url, price } = req.body;

        if (req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Only admins can add hotels.' });
        }

        const query = `
            INSERT INTO Hotels (name, location, description, rating, image_url, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING * 
        `;
        const values = [name, location, description, rating, image_url, price];
        const result = await client.query(query, values);

        res.status(201).json("Hotel inserted successfully!");
    } catch (error) {
        console.error('Error adding hotel:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;