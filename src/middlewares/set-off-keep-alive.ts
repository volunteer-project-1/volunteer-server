import Container from "typedi";
import { Application } from "express";
import { Emitter, logger } from "../utils";

export function setOffKeepAlive(app: Application) {
  const emitter = Container.get(Emitter).getInstance();
  let isDisableKeepAlive = false;
  emitter.on("offKeepAlive", () => {
    isDisableKeepAlive = true;
    logger.info("Set off 'keep-alive' header");
  });

  app.use((_, res, next) => {
    if (isDisableKeepAlive) {
      res.set("Connection", "close");
    }
    next();
  });
}
