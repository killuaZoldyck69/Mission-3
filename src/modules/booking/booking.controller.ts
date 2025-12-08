import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    // const user = req.user as any;

    // if (user.role === "customer") {
    //   req.body.customer_id = user.id;
    // }

    const result = await bookingServices.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
      error: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const result = await bookingServices.getAllBookings(user.id, user.role);

    // Dynamic success message
    const message =
      user.role === "admin"
        ? "All bookings retrieved successfully"
        : "My bookings retrieved successfully";

    res.status(200).json({
      success: true,
      message: message,
      data: result,
    });
  } catch (error: any) {
    console.log("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
      error: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
};
