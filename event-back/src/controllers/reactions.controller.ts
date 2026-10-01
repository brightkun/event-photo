import { NextFunction, Request, Response } from "express";
import { toggleReactionService } from "../services/reactions.service";

export const toggleReactionController = async (
  req: Request<{ slug: string; photoId: string }, {}, { emoji: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug, photoId } = req.params;
    const token = req.header("x-guest-token");
    const result = await toggleReactionService(slug, photoId, token, req.body);

    res.status(200).json({
      message: "reactions",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
