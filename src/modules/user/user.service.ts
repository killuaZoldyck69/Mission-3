import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
};

const updateUser = async (id: string, payload: Record<string, unknown>) => {
  const allowedFields = ["name", "email", "phone", "role"];

  const updates: string[] = [];
  const values: any[] = [];

  Object.keys(payload).forEach((key) => {
    if (allowedFields.includes(key) && payload[key] !== undefined) {
      updates.push(`${key} = $${updates.length + 1}`);
      values.push(payload[key]);
    }
  });

  if (updates.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  values.push(id);

  const queryText = `
    UPDATE users 
    SET ${updates.join(", ")} 
    WHERE id = $${values.length} 
    RETURNING id, name, email, phone, role;
  `;

  const result = await pool.query(queryText, values);

  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const checkBookingQuery = `
    SELECT * FROM bookings 
    WHERE customer_id = $1 AND status = 'active'
  `;
  const bookingCheck = await pool.query(checkBookingQuery, [id]);

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const queryText = `DELETE FROM users WHERE id = $1 RETURNING id`;
  const result = await pool.query(queryText, [id]);

  return result.rows[0];
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
