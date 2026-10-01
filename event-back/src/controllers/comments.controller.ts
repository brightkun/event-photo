import { NextFunction, Request, Response } from "express";
import {
  getCommentsService,
  postCommentService,
} from "../services/comments.service";

export const getCommentsController = async (
  req: Request<{ slug: string; photoId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug, photoId } = req.params;
    const result = await getCommentsService(slug, photoId);

    res.status(200).json({
      message: "comments list",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const postCommentController = async (
  req: Request<{ slug: string; photoId: string }, {}, { text: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug, photoId } = req.params;
    const token = req.header("x-guest-token");
    const result = await postCommentService(slug, photoId, token, req.body);

    res.status(201).json({
      message: "comment created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
