import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Mission 3 server is running...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
