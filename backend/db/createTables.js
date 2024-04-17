const client = require('../config/database');

const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE CECK(email LIKE '%@%.com%'),
        password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
        role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'admin')),
        status VARCHAR(15) NOT NULL CHECK (status IN ('adult', 'student')),
        balance DECIMAL(10, 2) NOT NULL DEFAULT 10000000
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
        booking_date DATE, 
        booking_details TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
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

    CREATE TABLE IF NOT EXISTS Hotels (
        hotel_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        location VARCHAR(100),
        rating DECIMAL(3,2),
        image_url VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL CHECK (price > 0) 
    );

    CREATE OR REPLACE FUNCTION validate_flight_schedule() RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.departure_time >= NEW.arrival_time THEN
            RAISE EXCEPTION 'Departure time must be before arrival time';
        END IF;
         
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS flight_schedule_validation_trigger ON Flights;
    CREATE TRIGGER flight_schedule_validation_trigger
    BEFORE INSERT ON Flights
    FOR EACH ROW
    EXECUTE FUNCTION validate_flight_schedule();

    CREATE OR REPLACE FUNCTION set_flight_price() RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.booking_type = 'flight' AND NEW.user_id IN (SELECT user_id FROM Users WHERE status = 'student') THEN
            NEW.price = NEW.price * 0.5;
        END IF;

        -- Return the new row
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

   
    DROP TRIGGER IF EXISTS set_flight_price_trigger ON Bookings;

    CREATE TRIGGER set_flight_price_trigger
    BEFORE INSERT ON Bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_flight_price();


    CREATE OR REPLACE FUNCTION update_destination_rating() RETURNS TRIGGER AS $$
    DECLARE
        avg_rating DECIMAL(3, 2);
    BEGIN
  
        SELECT AVG(rating) INTO avg_rating
        FROM Reviews
        WHERE destination_id = NEW.destination_id;

        UPDATE Destinations
        SET rating = avg_rating
        WHERE destination_id = NEW.destination_id;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_destination_rating_trigger ON Reviews;
    CREATE TRIGGER update_destination_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON Reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_destination_rating();
`;
client.query(createUsersTableQuery, (err) => {
    if (err) {
        console.error('Error creating tables:', err);
    } else {
        console.log('Tables created successfully');
    }
});
