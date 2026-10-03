import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import {
  deleteEventService,
  getEventBySlugService,
  getMyEventsService,
  postEventService,
} from "../services/events.service";

export const postEventController = async (
  req: AuthRequest<
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
    const result = await postEventService(body, req.user!);

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

export const getMyEventsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getMyEventsService(req.user!);

    res.status(200).json({
      message: "my events",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEventController = async (
  req: AuthRequest<{ slug: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteEventService(req.params.slug, req.user!);

    res.status(200).json({
      message: "Deleted successfully",
      deleted: result,
    });
  } catch (error) {
    next(error);
  }
};
