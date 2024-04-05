const client = require('../config/database');

const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
        role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'admin'))
    );

    CREATE TABLE IF NOT EXISTS Destinations (
        destination_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        location VARCHAR(100),
        rating DECIMAL(3,2),
        image_url VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS Reviews (
        review_id SERIAL PRIMARY KEY,
        destination_id INT,
        user_id INT,
        review_text TEXT,
        rating DECIMAL(3,2),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Bookings (
        booking_id SERIAL PRIMARY KEY,
        user_id INT,
        destination_id INT,
        booking_type VARCHAR(10) NOT NULL CHECK (booking_type IN ('hotel', 'flight')),
        booking_details TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Favorites (
        favorite_id SERIAL PRIMARY KEY,
        user_id INT,
        destination_id INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Flights (
        flight_id SERIAL PRIMARY KEY,
        airline VARCHAR(100),
        departure_airport VARCHAR(100) NOT NULL,
        arrival_airport VARCHAR(100) NOT NULL,
        departure_time TIMESTAMP,
        arrival_time TIMESTAMP,
        price DECIMAL(10,2)
    );

    CREATE TABLE IF NOT EXISTS Cuisines (
        cuisine_id SERIAL PRIMARY KEY,
        destination_id INT,
        cuisine_name VARCHAR(100),
        description TEXT,
        image_url VARCHAR(255),
        FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Restaurants (
        restaurant_id SERIAL PRIMARY KEY,
        destination_id INT,
        cuisine_id INT,
        name VARCHAR(100),
        address VARCHAR(255),
        contact_info VARCHAR(100),
        FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE,
        FOREIGN KEY (cuisine_id) REFERENCES Cuisines(cuisine_id) ON DELETE CASCADE
    );
`;

client.query(createUsersTableQuery, (err) => {
    if (err) {
        console.error('Error creating tables:', err);
    } else {
        console.log('Tables created successfully');
    }
});
