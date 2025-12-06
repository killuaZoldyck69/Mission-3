import express from "express";
import { authControllers } from "./auth.controller";

const router = express.Router();

// /api/1v / auth / signup;

router.post("/signup", authControllers.signUp);

export const authRouter = router;
