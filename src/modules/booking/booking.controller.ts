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

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = req.user as any;

    const result = await bookingServices.updateBooking(
      bookingId as string,
      status,
      user.id,
      user.role
    );

    // Dynamic Response Message
    let message = "Booking updated successfully";
    if (status === "returned")
      message = "Booking marked as returned. Vehicle is now available";
    if (status === "cancelled") message = "Booking cancelled successfully";

    // Structure the response to match your requirement
    // If returned, we show the vehicle status availability
    const responseData = { ...result };
    if (status === "returned") {
      responseData.vehicle = { availability_status: "available" };
    }

    res.status(200).json({
      success: true,
      message: message,
      data: responseData,
    });
  } catch (error: any) {
    console.log("Error updating booking:", error);

    if (error.message === "Booking not found") {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    if (error.message === "You are not authorized to update this booking") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (error.message === "Customers can only cancel bookings") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status update" });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBooking,
};
