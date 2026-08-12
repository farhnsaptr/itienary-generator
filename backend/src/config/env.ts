import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.string().default("4000").transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET must be provided"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET must be provided"),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),

  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY must be provided"),

  R2_ACCOUNT_ID: z.string().min(1, "R2_ACCOUNT_ID must be provided"),
  R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID must be provided"),
  R2_SECRET_ACCESS_KEY: z.string().min(1, "R2_SECRET_ACCESS_KEY must be provided"),
  R2_BUCKET_NAME: z.string().min(1, "R2_BUCKET_NAME must be provided"),
  R2_PUBLIC_URL: z.string().url("R2_PUBLIC_URL must be a valid URL"),

  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL").default("http://localhost:5173"),

  ADMIN_USERNAME: z.string().default("admin"),
  ADMIN_EMAIL: z.string().email().default("admin@example.com"),
  ADMIN_PASSWORD: z.string().min(6).default("AdminPassword123!"),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("[ERROR] Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment variables");
  }
  return result.data;
};

export const env = parseEnv();
