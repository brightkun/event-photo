import { NextFunction, Request, Response } from "express";
import {
  getEventBySlugService,
  postEventService,
} from "../services/events.service";

export const postEventController = async (
  req: Request<
    {},
    {},
    {
      name: string;
      date: string;
      location: string;
    }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const result = await postEventService(body);

    res.status(201).json({
      message: "event created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventBySlugController = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug;
    const result = await getEventBySlugService(slug);

    res.status(200).json({
      message: "event",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
