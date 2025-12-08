import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signUp = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string, 10);

  const queryText = `
    INSERT INTO users(name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
  const values = [name, email, hashedPass, phone, role];

  const result = await pool.query(queryText, values);

  return result;
};

const signIn = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = ($1)`, [
    email,
  ]);

  // Check if user exists
  if (result.rowCount === 0) {
    throw new Error("User does not exist");
  }

  const user = result.rows[0];

  // Check if password matches
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password incorrect");
  }

  const jwtPayload = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "5d",
  });

  console.log(accessToken);

  const { password: _, ...userData } = user;

  return {
    success: true,
    message: "User logged in successfully",
    token: accessToken,
    data: userData,
  };
};

export const authServices = {
  signUp,
  signIn,
};
