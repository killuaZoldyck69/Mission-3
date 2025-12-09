import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";
import { vehicleRouter } from "./modules/vehicle/vehicle.routes";
import { userRouter } from "./modules/user/user.routes";
import { bookingRouter } from "./modules/booking/booking.routes";

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Mission 3 server is running...");
});

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/vehicles", vehicleRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/bookings", bookingRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// admin token : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1MjI1NzU5LCJleHAiOjE3NjU2NTc3NTl9.mJkuptp0cXeYtK5HQYhlAWWuLCD4qbGDIraYlPbhWtg
// customer 2 token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY1MjI1OTE1LCJleHAiOjE3NjU2NTc5MTV9.YrrHUlkx5U-Lu7-6YKMhwPjDvPVsCvCGj8VEgklyk3Y
// customer 3 token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6IlNhcmFoIFNtaXRoIiwiZW1haWwiOiJzYXJhaEBleGFtcGxlLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc2NTIyNjY4OCwiZXhwIjoxNzY1NjU4Njg4fQ.F8Y4JmgsJYnXnWqtpzZTDvncIDEmm0eo53rioiJu3Hc
