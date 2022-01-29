import "reflect-metadata";

import express, { Request, Response, NextFunction } from "express";
import colors from "colors";
import config from "./config";
import routes from "./router";
import { Mongo, logger, ExError, loggingReq } from "./utils";

const app: express.Application = express();

async function start() {
  app.use(express.json());
  await Mongo.connect();

  app.use(loggingReq);

  app.use(config.api.prefix, routes);

  app.use(() => {
    throw new ExError(404, "Not Found");
  });

  /* eslint-disable */
  app.use((err: ExError, req: Request, res: Response, next: NextFunction) => {
    logger.error(colors.red(JSON.stringify(err)));

    const status = err.status ? err.status : 500;
    const message = err.message ? err.message : "SERVER_ERROR";

    res.status(status).json({ message });
  });

  app.listen(3000, () => {
    logger.info(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
        `);
  });
}

start();
