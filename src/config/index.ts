import type { PoolOptions } from "mysql2/promise";
import type { _StrategyOptionsBase } from "passport-google-oauth20";

// Set the NODE_ENV to 'development' by default
const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 3000;

export const DB_CONFIG: PoolOptions =
  NODE_ENV === "production"
    ? {}
    : {
        host: process.env.DB_HOST || "",
        user: "admin",
        port: 3306,
        database: process.env.DATABASE || "",
        password: process.env.DB_PASSWORD || "",
      };

export const API_PREFIX = "/api";

export const GOOGLE_CONFIG: _StrategyOptionsBase = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL:
    process.env.GOOGLE_CALLBACK_URL ||
    "http://www.example.com/auth/google/callback",
};
