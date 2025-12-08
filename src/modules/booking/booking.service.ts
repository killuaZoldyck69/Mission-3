import { pool } from "../../config/db";

const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Get the vehicle to check price and availability
  const vehicleRes = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicle_id,
  ]);
  const vehicle = vehicleRes.rows[0];

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  // Calculate Total Price
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  // Calculate difference in milliseconds -> convert to days
  const differenceInTime = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  const totalPrice = days * vehicle.daily_rent_price;

  // Create the Booking
  const bookingQuery = `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *;
  `;

  const bookingRes = await pool.query(bookingQuery, [
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    totalPrice,
  ]);

  const newBooking = bookingRes.rows[0];

  // Update Vehicle Status to 'booked'
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...newBooking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

export const bookingServices = {
  createBooking,
};
