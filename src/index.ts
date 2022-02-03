import "reflect-metadata";

import express, { Request, Response, NextFunction } from "express";
import colors from "colors";
import Container from "typedi";
import passport from "passport";
import session from "express-session";
import routes from "./router";
import { ExError, logger, MySQL } from "./utils";
import { API_PREFIX, PORT } from "./config";
import { loggingReq } from "./middlewares";
import passportConfig from "./passports";

const app: express.Application = express();

async function start() {
  await Container.get(MySQL).connect();

  app.use(express.json());
  app.set("trust proxy", 1);

  passportConfig();
  app.use(session({ secret: "secret" }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(loggingReq);

  app.get("/health", (_, res) => {
    res.send("ok");
  });

  app.post("/health2", (req, res) => {
    const body = req.body;
    res.json({ body });
  });

  app.use(API_PREFIX, routes);

  app.use("*", (_, res) => {
    res.json({ message: "Un Valid URL" });
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
