import { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE, AuthRequest } from "../middlewares/auth";
import {
  loginService,
  registerService,
  signToken,
  tokenMaxAge,
} from "../services/auth.service";

// Cookie недоступна для JS на странице (httpOnly), так токен не украсть через XSS
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: !!process.env.VERCEL,
  path: "/",
} as const;

export const registerController = async (
  req: Request<{}, {}, { name?: string; email?: string; password?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await registerService(req.body ?? {});

    res.cookie(AUTH_COOKIE, signToken(user.id), {
      ...cookieOptions,
      maxAge: tokenMaxAge,
    });

    res.status(201).json({
      message: "registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request<{}, {}, { email?: string; password?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await loginService(req.body ?? {});

    res.cookie(AUTH_COOKIE, signToken(user.id), {
      ...cookieOptions,
      maxAge: tokenMaxAge,
    });

    res.status(200).json({
      message: "logged in successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE, cookieOptions);

  res.status(200).json({ message: "logged out" });
};

export const getMeController = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  res.status(200).json({
    message: "current user",
    data: req.user ?? null,
  });
};
