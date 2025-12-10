import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";
import { vehicleRouter } from "./modules/vehicle/vehicle.routes";
import { userRouter } from "./modules/user/user.routes";
import { bookingRouter } from "./modules/booking/booking.routes";

const app = express();

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Mission 3 server is running...");
});

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/vehicles", vehicleRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/bookings", bookingRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
