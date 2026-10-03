import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { uploadsDir } from "./plugins/storage";
import accountRouter from "./routes/account.route";
import adminRouter from "./routes/admin.route";
import authRouter from "./routes/auth.route";
import eventsRouter from "./routes/events.route";
import guestsRouter from "./routes/guests.route";
import photosRouter from "./routes/photos.route";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  }),
);

app.use(
  "/uploads",
  express.static(uploadsDir, {
    setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
  }),
);

app.use("/auth", authRouter);
app.use("/account", accountRouter);
app.use("/admin", adminRouter);
app.use("/events", eventsRouter);
app.use("/events/:slug/guests", guestsRouter);
app.use("/events/:slug/photos", photosRouter);

app.use(errorHandler);

const port = 5000;

// На Vercel приложение экспортируется, а порт слушает сама платформа.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`server is on ${port}`);
  });
}

export default app;
