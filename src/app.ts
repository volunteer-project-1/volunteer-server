import "reflect-metadata";

import express from "express";
import Container from "typedi";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import routes from "./router";
import { API_PREFIX, CORS_CONFIG, SESSION_OPTION } from "./config";
import {
  loggingReq,
  logExErrorMiddleware,
  logMulterErrorMiddleware,
  logDbErrorMiddleware,
  logInternalServerErrorMiddleware,
} from "./middlewares";
import passportConfig from "./passports";
import { MySQL, Redis } from "./db";
import { HTTP_STATUS_CODE } from "./constants";

export async function startApp() {
  const app = express();

  await Container.get(Redis).initialize(session);
  const RedisStore = Container.get(Redis).getRedisStore();
  await Container.get(MySQL).connect();

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

  app.get("/health", (_, res) => {
    res.send("ok2");
  });

  app.use(API_PREFIX, routes);

  app.use("*", (_, res) => {
    res.status(HTTP_STATUS_CODE.NOT_FOUND);
    res.json({ message: "Un Valid URL" });
  });

  app.use(logMulterErrorMiddleware);
  app.use(logExErrorMiddleware);
  app.use(logDbErrorMiddleware);
  app.use(logInternalServerErrorMiddleware);

  return app;
}
