import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth.middleware";
import isAdmin from "../../middlewares/admin.middleware";

const router = Router();

// /api/v1/users

router.get("/", auth, isAdmin, userControllers.getAllUsers);

router.put("/:userId", auth, userControllers.updateUser);

export const userRouter = router;
