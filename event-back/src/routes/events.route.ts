import { Router } from "express";
import {
  deleteEventController,
  getEventBySlugController,
  postEventController,
} from "../controllers/events.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.post("/", requireAuth, postEventController);
router.get("/:slug", getEventBySlugController);
router.delete("/:slug", requireAuth, deleteEventController);

export default router;
