import { CorsOptions } from "cors";
import { env } from "./env";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    const clientUrlClean = (env.CLIENT_URL || "").replace(/\/$/, "");
    const originClean = origin.replace(/\/$/, "");

    if (
      originClean === clientUrlClean ||
      env.NODE_ENV === "development" ||
      originClean.startsWith("http://localhost:") ||
      originClean.startsWith("http://127.0.0.1:") ||
      originClean.startsWith("http://192.168.")
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS Policy: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
