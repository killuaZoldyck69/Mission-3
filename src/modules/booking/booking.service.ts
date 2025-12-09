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
    rent_start_date: new Date(newBooking.rent_start_date).toLocaleDateString(
      "en-CA"
    ),
    rent_end_date: new Date(newBooking.rent_end_date).toLocaleDateString(
      "en-CA"
    ),
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const returnExpiredBookings = async () => {
  const updateBookingsQuery = `
  UPDATE bookings
  SET status = 'returned'
  WHERE status = 'active' AND rent_end_date < NOW()
  RETURNING vehicle_id;
  `;

  const result = await pool.query(updateBookingsQuery);
  const affectedVehicleIds = result.rows.map((row) => row.vehicle_id);

  if (affectedVehicleIds.length > 0) {
    const updateVehiclesQuery = `
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = ANY($1::int[]);
    `;

    await pool.query(updateVehiclesQuery, [affectedVehicleIds]);
    console.log(`♻️ Auto-returned ${affectedVehicleIds.length} vehicles.`);
  }
};

const getAllBookings = async (userId: string, role: string) => {
  await returnExpiredBookings();

  let queryText = "";
  let values: any[] = [];

  if (role === "admin") {
    // ADMIN: Select columns
    queryText = `
      SELECT 
        b.id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, b.customer_id, b.vehicle_id,
        u.name AS user_name, u.email AS user_email,
        v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id;
    `;
  } else {
    // CUSTOMER: Select only booking and vehicle info
    queryText = `
      SELECT 
        b.id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, b.vehicle_id,
        v.vehicle_name, v.registration_number, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1;
    `;
    values = [userId];
  }

  const result = await pool.query(queryText, values);

  const formattedBookings = result.rows.map((row) => {
    let booking;

    if (role === "admin") {
      booking = {
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: new Date(row.rent_start_date).toLocaleDateString(
          "en-CA"
        ),
        rent_end_date: new Date(row.rent_end_date).toLocaleDateString("en-CA"),
        total_price: row.total_price,
        status: row.status,
        customer: {
          name: row.user_name,
          email: row.user_email,
        },
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      };
    } else {
      booking = {
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: new Date(row.rent_start_date)
          .toISOString()
          .split("T")[0],
        rent_end_date: new Date(row.rent_end_date).toISOString().split("T")[0],
        total_price: row.total_price,
        status: row.status,
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      };
    }

    return booking;
  });

  return formattedBookings;
};

const updateBooking = async (
  bookingId: string,
  status: string,
  userId: string,
  role: string
) => {
  const checkQuery = `SELECT * FROM bookings WHERE id = $1`;
  const checkResult = await pool.query(checkQuery, [bookingId]);

  if (checkResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = checkResult.rows[0];

  // Permission Logic
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

  // Update the Booking Status
  const updateQuery = `
    UPDATE bookings 
    SET status = $1 
    WHERE id = $2 
    RETURNING *;
  `;
  const updateResult = await pool.query(updateQuery, [status, bookingId]);
  const updatedBooking = updateResult.rows[0];

  updatedBooking.rent_start_date = new Date(
    updatedBooking.rent_start_date
  ).toLocaleDateString("en-CA");
  updatedBooking.rent_end_date = new Date(
    updatedBooking.rent_end_date
  ).toLocaleDateString("en-CA");

  // If the booking is finished (returned) or cancelled, free up the car
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
  returnExpiredBookings,
};
