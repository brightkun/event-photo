import { NextFunction, Request, Response } from "express";
import { postGuestService } from "../services/guests.service";

export const postGuestController = async (
  req: Request<{ slug: string }, {}, { name: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug;
    const body = req.body;
    const result = await postGuestService(slug, body);

    res.status(201).json({
      message: "guest joined successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
