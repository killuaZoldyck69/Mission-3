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

const getAllBookings = async (userId: string, role: string) => {
  let queryText = "";
  let values: any[] = [];

  if (role === "admin") {
    // ADMIN QUERY: Get ALL bookings + User Details + Vehicle Details
    // We use 'json_build_object' to create the nested structure you asked for
    queryText = `
      SELECT 
        b.id, 
        b.customer_id, 
        b.vehicle_id, 
        b.rent_start_date, 
        b.rent_end_date, 
        b.total_price, 
        b.status,
        json_build_object('name', u.name, 'email', u.email) AS customer,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id;
    `;
  } else {
    // CUSTOMER QUERY: Get OWN bookings + Vehicle Details (No need for user info)
    queryText = `
      SELECT 
        b.id, 
        b.vehicle_id, 
        b.rent_start_date, 
        b.rent_end_date, 
        b.total_price, 
        b.status,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) AS vehicle
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1;
    `;
    values = [userId];
  }

  const result = await pool.query(queryText, values);
  return result.rows;
};

const updateBooking = async (
  bookingId: string,
  status: string,
  userId: string,
  role: string
) => {
  // 1. Get the existing Booking to check ownership and vehicle_id
  const checkQuery = `SELECT * FROM bookings WHERE id = $1`;
  const checkResult = await pool.query(checkQuery, [bookingId]);

  if (checkResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = checkResult.rows[0];

  // 2. Permission Logic
  if (role === "customer") {
    // Rule: Customer can only update their own booking
    if (booking.customer_id !== userId) {
      throw new Error("You are not authorized to update this booking");
    }
    // Rule: Customer can ONLY set status to 'cancelled'
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }
  }

  // 3. Update the Booking Status
  const updateQuery = `
    UPDATE bookings 
    SET status = $1 
    WHERE id = $2 
    RETURNING *;
  `;
  const updateResult = await pool.query(updateQuery, [status, bookingId]);
  const updatedBooking = updateResult.rows[0];

  // 4. Handle Vehicle Availability
  // If the booking is finished (returned) or cancelled, free up the car.
  if (status === "returned" || status === "cancelled") {
    const freeVehicleQuery = `
      UPDATE vehicles 
      SET availability_status = 'available' 
      WHERE id = $1;
    `;
    await pool.query(freeVehicleQuery, [booking.vehicle_id]);
  }

  return updatedBooking;
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBooking,
};
