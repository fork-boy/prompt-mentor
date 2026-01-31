import { Router } from "express";
import { promptController } from "../controllers/prompt.controller";
import { Request, Response } from "express";

/**
 * Prompt Routes
 */

const router = Router();

/**
 * POST /api/prompt/improve
 * Improve a prompt with analysis-based system prompt guidance
 */
router.post("/improve", (req: Request, res: Response) =>
  promptController.improve(req, res),
);

/**
 * GET /api/prompt/health
 * Health check
 */
router.get("/health", (req: Request, res: Response) =>
  promptController.health(req, res),
);

export default router;
