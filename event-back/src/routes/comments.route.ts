import { Router } from "express";
import {
  getCommentsController,
  postCommentController,
} from "../controllers/comments.controller";

const router = Router({ mergeParams: true });
router.get("/", getCommentsController);
router.post("/", postCommentController);

export default router;
