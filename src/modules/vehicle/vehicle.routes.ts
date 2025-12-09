import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import isAdmin from "../../middlewares/admin.middleware";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

// /api/v1/vehicles

router.post("/", auth, isAdmin, vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getAllVehicles);

router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

router.put("/:vehicleId", auth, isAdmin, vehicleControllers.updateVehicle);

router.delete("/:vehicleId", auth, isAdmin, vehicleControllers.deleteVehicle);

export const vehicleRouter = router;
