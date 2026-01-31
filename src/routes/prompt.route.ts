import { Router } from "express";
import { promptController } from "../controllers/prompt.controller";

/**
 * Prompt Routes
 */

const router = Router();

/**
 * POST /api/prompt/improve
 * Improve a prompt with analysis-based system prompt guidance
 */
router.post("/improve", (req, res) => promptController.improve(req, res));

/**
 * GET /api/prompt/health
 * Health check
 */
router.get("/health", (req, res) => promptController.health(req, res));

export default router;
