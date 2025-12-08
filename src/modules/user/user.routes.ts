import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth.middleware";
import isAdmin from "../../middlewares/admin.middleware";

const router = Router();

// /api/v1/users

router.get("/users", auth, isAdmin, userControllers.getAllUsers);

export const userRouter = router;
