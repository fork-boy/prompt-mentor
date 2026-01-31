import express, { Express, Request, Response, NextFunction } from "express";
import promptRoutes from "./routes/prompt.route";
import { config } from "./config/env";

/**
 * Express Server Configuration
 */

export function createServer(): Express {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Routes
  app.use("/api/prompt", promptRoutes);

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found" });
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: config.nodeEnv === "development" ? err.message : undefined,
    });
  });

  return app;
}

export default createServer;
