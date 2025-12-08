import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

// /api/v1/bookings

router.post("/", auth, bookingControllers.createBooking);

router.get("/", auth, bookingControllers.getAllBookings);

router.put("/:bookingId", auth, bookingControllers.updateBooking);

export const bookingRouter = router;
