import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { allowedMimeTypes } from "../plugins/storage";
import { apiError } from "../utils/apiError";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, allowedMimeTypes.includes(file.mimetype));
  },
});

export const uploadPhoto = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single("photo")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "File is too large (max 15MB)"
          : err.message;
      return next(apiError.badRequest(message));
    }

    next(err);
  });
};
