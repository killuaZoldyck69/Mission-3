import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getSingleVehicle(
      req.params.vehicleId as string
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const updatedData = req.body;

    const result = await vehicleService.updateVehicle(
      req.params.vehicleId as string,
      updatedData
    );

    // Check vehicle is exist or not
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error updating vehicle:", error);

    // Check for duplicate registration number
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Vehicle with this registration number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
      error: error.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
};
