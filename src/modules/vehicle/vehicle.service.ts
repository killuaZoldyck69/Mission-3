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

const getSingleVehicle = async (vehicleId: string) => {
  const queryText = `SELECT * FROM vehicles WHERE id = ($1)`;
  const result = await pool.query(queryText, [vehicleId]);
  return result.rows;
};

const updateVehicle = async (
  vehicleId: string,
  payload: Record<string, unknown>
) => {
  const allowedFields = [
    "vehicle_name",
    "type",
    "registration_number",
    "daily_rent_price",
    "availability_status",
  ];

  const updates: string[] = [];
  const values: any[] = [];

  Object.keys(payload).forEach((key) => {
    if (allowedFields.includes(key) && payload[key] !== undefined) {
      updates.push(`${key} = $${updates.length + 1}`);
      values.push(payload[key]);
    }
  });

  // If no valid fields were sent, throw error or return null
  if (updates.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  values.push(vehicleId);

  const queryText = `
    UPDATE vehicles 
    SET ${updates.join(", ")} 
    WHERE id = $${values.length} 
    RETURNING *;
  `;

  const result = await pool.query(queryText, values);

  return result.rows[0];
};

const deleteVehicle = async (vehicleId: string) => {
  const checkBookingQuery = `SELECT * FROM bookings WHERE id = ($1) AND status = 'active'`;
  const bookingCheck = await pool.query(checkBookingQuery, [vehicleId]);

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = ($1) RETURNING *`,
    [vehicleId]
  );

  return result.rows[0];
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
