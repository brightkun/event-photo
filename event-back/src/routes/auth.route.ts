import { Router } from "express";
import {
  getMeController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller";
import { optionalAuth } from "../middlewares/auth";

const router = Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", optionalAuth, getMeController);

export default router;
