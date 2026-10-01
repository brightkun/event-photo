import { Router } from "express";
import {
  deletePhotoController,
  getPhotoController,
  getPhotosController,
  postPhotoController,
} from "../controllers/photos.controller";
import { uploadPhoto } from "../middlewares/uploadPhoto";
import commentsRouter from "./comments.route";
import reactionsRouter from "./reactions.route";

const router = Router({ mergeParams: true });
router.get("/", getPhotosController);
router.post("/", uploadPhoto, postPhotoController);
router.get("/:photoId", getPhotoController);
router.delete("/:photoId", deletePhotoController);
router.use("/:photoId/reactions", reactionsRouter);
router.use("/:photoId/comments", commentsRouter);

export default router;
