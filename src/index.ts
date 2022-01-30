import "reflect-metadata";

import express, { Request, Response, NextFunction } from "express";
import colors from "colors";
import Container from "typedi";
import routes from "./router";
import { ExError, logger, loggingReq, MySQL } from "./utils";
import { API_PREFIX, PORT } from "./config";

const app: express.Application = express();

async function start() {
  app.use(express.json());

  await Container.get(MySQL).connect();

  app.use(loggingReq);

  app.use(API_PREFIX, routes);

  app.use("*", (_, res) => {
    res.json({ msg: "Un Valid URL" });
  });

  app.use((err: ExError, _: Request, res: Response, __: NextFunction) => {
    if (err instanceof ExError) {
      logger.error(colors.blue(JSON.stringify(err)));
      res.status(err.status);
      res.json({ name: err.name, message: err.message });

      return;
    }

    logger.error(colors.red(JSON.stringify(err)));
    res.status(500).json({ message: "SERVER_ERROR" });
  });

  app.listen(PORT, () => {
    logger.info(`
        ################################################
        🛡️  Server listening on port: ${PORT} 🛡️
        ################################################
        `);
  });
}

start();
