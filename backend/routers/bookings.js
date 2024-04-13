const express = require('express');
const router = express.Router();
const client = require('../config/database');
const verifyToken = require('../middlewares/auth');

router.post('/', verifyToken, async (req, res) => {
    const { user_id, destination_id, booking_type, booking_date, booking_details } = req.body;
    try {
        const userBalanceResult = await pool.query('SELECT balance FROM Users WHERE user_id = $1', [user_id]);
        const userBalance = userBalanceResult.rows[0].balance;
        const bookingAmount = await getBookingAmount(destination_id);

        if (userBalance < bookingAmount) {
            return res.status(400).json({ message: 'Insufficient balance to make the booking.' });
        }

        await client.query('BEGIN TRANSACTION');
        await client.query('UPDATE Users SET balance = balance - $1 WHERE user_id = $2', [bookingAmount, user_id]);
        await client.query('INSERT INTO Bookings (user_id, destination_id, booking_type, booking_date, booking_details) VALUES ($1, $2, $3, $4, $5)', [user_id, destination_id, booking_type, booking_date, booking_details]);
        await client.query('COMMIT');
 
        res.status(200).json({ message: 'Booking successful!' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An error occurred while processing the booking.' });
    }
});

async function getBookingAmount(destination_id) {
    const result = await pool.query('SELECT price FROM Hotels WHERE hotel_id = $1', [destination_id]);
    return result.rows[0].price;
}
 
router.get('/', verifyToken, async (req, res) => {
    const userId = req.params.userId;
    try {
        const bookings = await client.query('SELECT * FROM Bookings WHERE user_id = $1', [userId]);
        res.status(200).json(bookings.rows);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An error occurred while retrieving bookings.' });
    }
});