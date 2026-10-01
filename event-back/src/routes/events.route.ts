import { Router } from "express";
import {
  getEventBySlugController,
  postEventController,
} from "../controllers/events.controller";

const router = Router();
router.post("/", postEventController);
router.get("/:slug", getEventBySlugController);

export default router;
