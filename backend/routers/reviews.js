const express = require('express')
const router = express.Router()
const client = require('../config/database')
const verifyToken = require('../middlewares/auth');

router.post('/:destinationId', verifyToken, (req, res) => {
    const destinationId = req.params.destinationId;
    const { reviewText, rating } = req.body;
    const userId = req.userId;

    const insertReviewQuery = `
        INSERT INTO Reviews (destination_id, user_id, review_text, rating, timestamp)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    `; 
    const values = [destinationId, userId, reviewText, rating];

    client.query(insertReviewQuery, values, (err) => {
        if (err) {
            console.error('Error executing insert review query:', err);
            res.status(500).send('Internal Server Error'); 
            return;
        }
        res.status(201).send('Review added successfully');
    });
});

module.exports = router;