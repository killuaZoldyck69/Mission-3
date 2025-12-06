import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const signUp = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  console.log(payload);

  const hashedPass = await bcrypt.hash(password as string, 10);

  const queryText = `
    INSERT INTO users(name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
  const values = [name, email, hashedPass, phone, role];

  const result = await pool.query(queryText, values);

  return result;
};

export const authServices = {
  signUp,
};
