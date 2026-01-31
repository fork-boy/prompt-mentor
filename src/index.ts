import { createServer } from "./server";
import { config } from "./config/env";

/**
 * Application Bootstrap
 */

const app = createServer();
const port = config.port;

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(
    `📊 API available at http://localhost:${port}/api/prompt/improve`,
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
