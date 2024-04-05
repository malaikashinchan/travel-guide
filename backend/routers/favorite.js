const express = require('express');
const router = express.Router();
const client = require('../config/database');
const verifyToken = require('../middlewares/auth');
const e = require('express');

router.post('/', verifyToken, async (req, res) => {
    const { destination_id } = req.body;
    const user_id = req.userId;

    try {
        const query = `
        INSERT INTO Favorites (user_id, destination_id, timestamp)
        VALUES ($1, $2, NOW()) -- Using NOW() to insert current timestamp
      `;
        await client.query(query, [user_id, destination_id]);

        res.status(201).json({ message: 'Favorite inserted successfully' });
    } catch (error) {
        console.error('Error inserting favorite:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/', verifyToken, async (req, res) => {
    const { destination_id } = req.body;
    const user_id = req.userId; 

    try {
        const query = `
        DELETE FROM Favorites
        WHERE user_id = $1 AND destination_id = $2
      `;
        await client.query(query, [user_id, destination_id]);

        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;