import "reflect-metadata";

import express, { Request, Response, NextFunction } from "express";
import colors from "colors";
import Container from "typedi";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import routes from "./router";
import { ExError, logger } from "./utils";
import { API_PREFIX, CORS_CONFIG, isProd, SESSION_SECRET } from "./config";
import { loggingReq, mockAuthenticateUser } from "./middlewares";
import passportConfig from "./passports";
import { MySQL } from "./db";

export async function startApp() {
  const app: express.Application = express();
  await Container.get(MySQL).connect();

  app.use(cors(CORS_CONFIG));
  app.set("trust proxy", 1);
  app.use(express.json());

  passportConfig();
  app.use(session({ secret: SESSION_SECRET }));
  app.use(passport.initialize());
  app.use(passport.session());
  if (!isProd) {
    app.use(mockAuthenticateUser);
  }
  app.use(loggingReq);

  //   if (isProd) {
  //     app.use(loggingReq);
  //   }

  app.get("/health", (_, res) => {
    res.send("ok");
  });

  //   app.post("/health2", (req, res) => {
  //     const body = req.body;
  //     res.json({ body });
  //   });

  app.use(API_PREFIX, routes);

  app.use("*", (_, res) => {
    res.status(404);
    res.json({ message: "Un Valid URL" });
  });

  app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    if (err instanceof ExError) {
      logger.error(colors.blue(JSON.stringify(err)));
      res.status(err.status);
      res.json({ name: err.name, message: err.message });

      return;
    }
    if (err.sqlMessage || err.sqlState || err.sql) {
      logger.error(colors.blue(JSON.stringify(err)));
      res.status(500);
      res.json({ name: err.code, message: err.sqlMessage, sql: err.sql });

      return;
    }

    logger.error(colors.red(JSON.stringify(err)));
    res.status(500).json({ message: "SERVER_ERROR" });
  });

  return app;
}

startApp();
