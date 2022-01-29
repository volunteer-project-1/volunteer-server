import type { PoolOptions } from "mysql2";

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
