import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  logLevel: process.env.LOG_LEVEL || "info",
};
