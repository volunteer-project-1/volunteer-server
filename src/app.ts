import "reflect-metadata";

import express from "express";
import Container from "typedi";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import colors from "colors";
import routes from "./router";
import { API_PREFIX, CORS_CONFIG, SESSION_OPTION } from "./config";
import {
  loggingReq,
  logExErrorMiddleware,
  logMulterErrorMiddleware,
  logDbErrorMiddleware,
  logInternalServerErrorMiddleware,
  setOffKeepAlive,
} from "./middlewares";
import passportConfig from "./passports";
import { RedisSession } from "./db";
import { HTTP_STATUS_CODE } from "./constants";
import { logger } from "./utils";

export async function startApp() {
  const app = express();

  const redis = Container.get(RedisSession);
  await redis.initialize(session);
  const RedisStore = redis.getRedisStore();

  app.use(setOffKeepAlive);

  app.use(helmet());

  app.use(cors(CORS_CONFIG));
  app.set("trust proxy", 1);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  passportConfig();
  app.use(
    session({
      ...SESSION_OPTION,
      store: RedisStore,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(loggingReq);

  app.use(API_PREFIX, routes);

  app.use("*", (_, res) => {
    const message = "Un Valid URL";
    logger.info(colors.red(JSON.stringify(message)));
    res.status(HTTP_STATUS_CODE.NOT_FOUND);
    res.json({ message });
  });

  app.use(logMulterErrorMiddleware);
  app.use(logExErrorMiddleware);
  app.use(logDbErrorMiddleware);
  app.use(logInternalServerErrorMiddleware);

  return app;
}
