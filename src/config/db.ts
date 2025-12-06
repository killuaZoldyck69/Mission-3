import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.connection_str,
});

const initDB = async () => {
  const queryText = `
    --CREATE users TABLE

    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL CHECK (email = lower(email)),
    password VARCHAR(255) NOT NULL CHECK (length(password) >= 6),
    phone VARCHAR(20) NOT NULL,
    role  VARCHAR(20) NOT NULL DEFAULT 'customer'
    );

    --CREATE vehicles TABLE

    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
    availability_status VARCHAR(20) NOT NULL DEFAULT 'available'
    );

    --CREATE bookings TABLE

    CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date TIMESTAMP NOT NULL,
    rent_end_date TIMESTAMP NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    CONSTRAINT check_dates CHECK (rent_end_date > rent_start_date) 
    );
    `;

  try {
    await pool.query(queryText);
    console.log("Database tables are created successfully");
  } catch (error) {
    console.log("Error creating tables", error);
  }
};

export default initDB;
