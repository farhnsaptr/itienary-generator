import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { corsOptions } from "./config/cors";
import { swaggerSpec } from "./config/swagger";
import mainRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

import { globalApiLimiter, authLimiter } from "./middlewares/rateLimiter";

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiters
app.use("/api", globalApiLimiter);
app.use("/api/auth", authLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Itinerary Generator API is operational 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", mainRouter);
app.use(errorHandler);

export default app;
