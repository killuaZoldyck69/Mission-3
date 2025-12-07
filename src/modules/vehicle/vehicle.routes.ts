import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import isAdmin from "../../middlewares/admin.middleware";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

// /api/v1/vehicles

router.post("/vehicles", auth, isAdmin, vehicleControllers.createVehicle);

router.get("/vehicles", vehicleControllers.getAllVehicles);

export const vehicleRouter = router;
