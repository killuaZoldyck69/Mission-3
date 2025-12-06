import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signUp(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went worng on the sever",
    });
  }
};

export const authControllers = {
  signUp,
};
