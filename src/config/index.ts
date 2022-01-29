import dotenv from "dotenv";
import { PoolOptions } from "mysql2";

// Set the NODE_ENV to 'development' by default
const NODE_ENV = process.env.NODE_ENV || "development";

export const DB_CONFIG: PoolOptions =
  NODE_ENV === "production"
    ? {}
    : {
        host: process.env.DB_HOST || "",
        user: "admin",
        port: 3306,
        database: process.env.DB_HOST || "",
        password: process.env.DB_PASSWORD || "",
      };

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT || "3000", 10),
  api: {
    prefix: "/api",
  },
};
