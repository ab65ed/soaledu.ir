import { Router } from "express";
import { protectRoute } from "../middlewares/auth";
import * as RolesController from "../controllers/roles";

const router = Router();

// Remove global protection for testing
// router.use(protectRoute);

router.get("/", RolesController.getRoles);
router.get("/permissions", RolesController.getPermissions);
router.get("/dashboard-stats", RolesController.getDashboardStats);

export default router;