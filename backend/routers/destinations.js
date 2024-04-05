const express = require('express')
const client = require('../config/database');
const verifyToken = require('../middlewares/auth');
const router = express.Router()

router.get('/', (req, res) => {
    client.query('SELECT D.*, COALESCE(AVG(R.rating), 0) AS average_rating FROM Destinations D LEFT JOIN Reviews R ON D.destination_id = R.destination_id GROUP BY D.destination_id', (err, result) => {
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

router.get('/location/:location', (req, res) => {
    const location = req.params.location;

    client.query('SELECT * FROM Destinations WHERE location = $1', [location], (err, result) => {
        if (err) {
            console.error('Error executing destinations query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(result.rows);
    });
});

router.get('/:id', async (req, res) => {
    const destinationId = req.params.id;
    
    try {
        const query = `
            SELECT 
                D.*, 
                C.cuisine_id, 
                C.cuisine_name, 
                C.description AS cuisine_description, 
                C.image_url AS cuisine_image_url,
                R.restaurant_id,
                R.name AS restaurant_name,
                R.address AS restaurant_address,
                R.contact_info AS restaurant_contact_info,
                RV.review_id,
                RV.user_id AS review_user_id,
                U.username AS review_username,
                RV.review_text,
                RV.rating AS review_rating,
                RV.timestamp AS review_timestamp
            FROM Destinations D
            LEFT JOIN Cuisines C ON D.destination_id = C.destination_id
            LEFT JOIN Restaurants R ON D.destination_id = R.destination_id
            LEFT JOIN Reviews RV ON D.destination_id = RV.destination_id
            LEFT JOIN Users U ON RV.user_id = U.user_id
            WHERE D.destination_id = $1
        `;
        
        const result = await client.query(query, [destinationId]);

        if (result.rows.length === 0) {
            return res.status(404).send('Destination not found');
        }

        const destination = {
            destination_id: result.rows[0].destination_id,
            name: result.rows[0].name,
            description: result.rows[0].description,
            location: result.rows[0].location,
            rating: result.rows[0].rating,
            image_url: result.rows[0].image_url,
            cuisines: result.rows.map(row => ({
                cuisine_id: row.cuisine_id,
                cuisine_name: row.cuisine_name,
                description: row.cuisine_description,
                image_url: row.cuisine_image_url
            })),
            nearbyRestaurants: result.rows.map(row => ({
                restaurant_id: row.restaurant_id,
                name: row.restaurant_name,
                address: row.restaurant_address,
                contact_info: row.restaurant_contact_info
            })),
            reviews: result.rows.map(row => ({
                review_id: row.review_id,
                user_id: row.review_user_id,
                username: row.review_username,
                review_text: row.review_text,
                rating: row.review_rating,
                timestamp: row.review_timestamp
            }))
        };

        res.json(destination);
    } catch (error) {
        console.error('Error fetching destination details:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router