const express = require('express')
const router = express.Router()
const client = require('../config/database')

router.get('/search', async (req, res) => {
    const { start_destination, end_destination } = req.query;

    try {
        const query = `
        SELECT * 
        FROM Flights 
        WHERE departure_airport = $1 
        AND arrival_airport = $2;
      `;
        const result = await client.query(query, [start_destination, end_destination]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error searching flights:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;