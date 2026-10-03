import { Router } from "express";
import {
  getAllEventsController,
  getStatsController,
  getUsersController,
} from "../controllers/admin.controller";
import { requireAdmin, requireAuth } from "../middlewares/auth";

const router = Router();
router.use(requireAuth, requireAdmin);
router.get("/stats", getStatsController);
router.get("/events", getAllEventsController);
router.get("/users", getUsersController);

export default router;
