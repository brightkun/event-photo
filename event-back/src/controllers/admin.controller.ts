import { NextFunction, Request, Response } from "express";
import {
  getAllEventsService,
  getStatsService,
  getUsersService,
} from "../services/admin.service";

export const getStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getStatsService();

    res.status(200).json({
      message: "stats",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllEventsService();

    res.status(200).json({
      message: "all events",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getUsersService();

    res.status(200).json({
      message: "users list",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
