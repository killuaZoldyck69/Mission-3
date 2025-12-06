import express from "express";
import { authControllers } from "./auth.controller";

const router = express.Router();

// /api/1v / auth / signup;

router.post("/signup", authControllers.signUp);

router.post("/signin", authControllers.signIn);

export const authRouter = router;
