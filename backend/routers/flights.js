const express = require('express')
const router = express.Router()
const client = require('../config/database')
const verifyToken = require('../middlewares/auth');

router.get('/', async (req, res) => {
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

router.post('/', async (req, res) => {
    const { airline, departure_airport, arrival_airport, departure_time, arrival_time, price } = req.body;

    try {
        const query = `
        INSERT INTO Flights (airline, departure_airport, arrival_airport, departure_time, arrival_time, price)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
        await client.query(query, [airline, departure_airport, arrival_airport, departure_time, arrival_time, price]);

        res.status(201).json({ message: 'Flight inserted successfully' });
    } catch (error) {
        console.error('Error inserting flight:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', verifyToken, (req, res) => {
    const flightId = req.params.id;

    if (req.userRole !== 'admin') {
        return res.status(403).send('Access denied. Only admins can delete flights.');
    }

    client.query('DELETE FROM Flights WHERE flight_id = $1', [flightId], (err, result) => {
        if (err) {
            console.error('Error executing delete flight query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (result.rowCount === 0) {
            return res.status(404).send('Flight not found');
        }
        res.status(200).send('Flight deleted successfully');
    });
});

module.exports = router;