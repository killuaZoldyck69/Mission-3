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

app.use("/api/v1", vehicleRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/bookings", bookingRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// admin token : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmFoaWQgSGFzYW4iLCJlbWFpbCI6Im5oNjk0MjIyNUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjUyMDkzMTcsImV4cCI6MTc2NTY0MTMxN30.qiyJcZ6uKVKWgOW-wEuIl91QScAi-MwE1PijVd3elIo
// customer token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY1MjA5NDA1LCJleHAiOjE3NjU2NDE0MDV9.OPZuGlDLLtvHz8JK06iWOwPNs3aiQ95GBKwKp4VfGOM
