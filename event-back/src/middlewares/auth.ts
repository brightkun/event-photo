import { NextFunction, Request, Response } from "express";
import { findUserByToken, IUser } from "../services/auth.service";
import { apiError } from "../utils/apiError";

export const AUTH_COOKIE = "token";

// Запрос, в котором middleware уже положил пользователя
export type AuthRequest<P = {}, B = {}> = Request<P, {}, B> & { user?: IUser };

// Достаёт пользователя из cookie. Без входа просто идём дальше (user будет пустым).
export const optionalAuth = async (
  req: AuthRequest<any, any>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await findUserByToken(req.cookies?.[AUTH_COOKIE]);
    if (user) req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth = async (
  req: AuthRequest<any, any>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await findUserByToken(req.cookies?.[AUTH_COOKIE]);

    if (!user) throw apiError.unauthorized("Please log in");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (
  req: AuthRequest<any, any>,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return next(apiError.forbidden("Admins only"));
  }

  next();
};
