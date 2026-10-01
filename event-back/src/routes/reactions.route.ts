import { Router } from "express";
import { toggleReactionController } from "../controllers/reactions.controller";

const router = Router({ mergeParams: true });
router.post("/", toggleReactionController);

export default router;
