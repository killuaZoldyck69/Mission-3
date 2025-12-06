import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Mission 3 server is running...");
});

app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
