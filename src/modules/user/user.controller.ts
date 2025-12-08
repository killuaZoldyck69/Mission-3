import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user as any;
    const updatedData = req.body;

    if (currentUser.role !== "admin" && currentUser.id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own profile",
      });
    }

    if (currentUser.role !== "admin" && updatedData.role) {
      delete updatedData.role;
    }

    const result = await userServices.updateUser(userId as string, updatedData);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
};

export const userControllers = {
  getAllUsers,
  updateUser,
};
