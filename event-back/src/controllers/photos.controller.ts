import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import {
  deletePhotoService,
  getPhotoService,
  getPhotosService,
  postPhotoService,
} from "../services/photos.service";

export const getPhotosController = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug;
    const result = await getPhotosService(slug);

    res.status(200).json({
      message: "photos list",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPhotoController = async (
  req: AuthRequest<{ slug: string; photoId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug, photoId } = req.params;
    const token = req.header("x-guest-token");
    const isAdmin = req.user?.role === "admin";
    const result = await getPhotoService(slug, photoId, token, isAdmin);

    res.status(200).json({
      message: "photo",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePhotoController = async (
  req: AuthRequest<{ slug: string; photoId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug, photoId } = req.params;
    const token = req.header("x-guest-token");
    const isAdmin = req.user?.role === "admin";
    const result = await deletePhotoService(slug, photoId, token, isAdmin);

    res.status(200).json({
      message: "Deleted successfully",
      deleted: result,
    });
  } catch (error) {
    next(error);
  }
};

export const postPhotoController = async (
  req: Request<{ slug: string }, {}, { width?: string; height?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug;
    const token = req.header("x-guest-token");
    const result = await postPhotoService(slug, token, req.file, req.body);

    res.status(201).json({
      message: "photo uploaded successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
