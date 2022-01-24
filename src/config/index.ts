import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT || "3000", 10),

  mongoURL: process.env.MONGO_ATLAS_URL || "",

  api: {
    prefix: "/api",
  },
};
