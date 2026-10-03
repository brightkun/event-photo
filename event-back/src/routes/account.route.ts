import { Router } from "express";
import { getMyEventsController } from "../controllers/events.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.get("/events", requireAuth, getMyEventsController);

export default router;
