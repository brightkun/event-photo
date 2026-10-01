import { Router } from "express";
import { postGuestController } from "../controllers/guests.controller";

const router = Router({ mergeParams: true });
router.post("/", postGuestController);

export default router;
