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
                H.hotel_id,
                H.name AS hotel_name,
                H.address AS hotel_address,
                H.contact_info AS hotel_contact_info,
                RV.review_id,
                RV.user_id AS review_user_id,
                U.username AS review_username,
                RV.review_text,
                RV.rating AS review_rating,
                RV.timestamp AS review_timestamp
            FROM Destinations D
            LEFT JOIN Cuisines C ON D.destination_id = C.destination_id
            LEFT JOIN Hotels H ON D.destination_id = H.destination_id
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
            nearbyHotels: result.rows.map(row => ({
                hotel_id: row.hotel_id,
                name: row.hotel_name,
                address: row.hotel_address,
                contact_info: row.hotel_contact_info
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

router.get('/location/:location', async (req, res) => {
    const locationName = req.params.location;
  
    try {
      const destinationsQuery = `
        SELECT *
        FROM Destinations
        WHERE location ILIKE $1
      `;
      const destinationsResult = await client.query(destinationsQuery, [`%${locationName}%`]);
      const destinations = destinationsResult.rows;

      const hotelsQuery = `
        SELECT *
        FROM Hotels
        WHERE location ILIKE $1
      `;
      const hotelsResult = await client.query(hotelsQuery, [`%${locationName}%`]);
      const hotels = hotelsResult.rows;
  
      const flightsQuery = `
        SELECT *
        FROM Flights
        WHERE departure_airport ILIKE $1 OR arrival_airport ILIKE $1
      `;
      const flightsResult = await client.query(flightsQuery, [`%${locationName}%`]);
      const flights = flightsResult.rows;
  
      res.status(200).json({ destinations, hotels, flights });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router