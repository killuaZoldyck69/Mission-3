import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const queryText = `
  INSERT INTO vehicles(
    vehicle_name, 
    type, 
    registration_number, 
    daily_rent_price, 
    availability_status
   )
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *;
  `;

  const values = [
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status || "available",
  ];

  const result = await pool.query(queryText, values);

  return result.rows[0];
};

const getAllVehicles = async () => {
  const queryText = `SELECT * FROM vehicles`;
  const result = await pool.query(queryText);
  return result.rows;
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
};
