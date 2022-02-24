import { startApp } from "./app";
import { PORT } from "./config";
import { logger } from "./utils";

startApp().then((app) => {
  app.listen(PORT, () => {
    logger.info(`
            ################################################
            🛡️  Server listening on port: ${PORT} 🛡️
            ################################################
            `);
  });
});
