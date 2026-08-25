import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./config/env.js";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";
import routes from "./routes/index.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

/* =========================================================
   SECURITY
========================================================= */

app.use(helmet());

/* =========================================================
   CORS
========================================================= */

console.log("FRONTEND_URL:", env.FRONTEND_URL);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

/* =========================================================
   RATE LIMITING
========================================================= */

app.use(globalLimiter);

/* =========================================================
   BODY PARSERS
========================================================= */

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(cookieParser());

/* =========================================================
   REQUEST LOGGER
========================================================= */

if (env.NODE_ENV !== "test") {
  app.use(
    morgan(
      env.NODE_ENV === "production"
        ? "combined"
        : "dev"
    )
  );
}

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DM Churu API is running",
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api", routes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use(notFoundHandler);

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(errorHandler);

export default app;