import Container from "typedi";
import { NextFunction, Request, Response } from "express";
import { Emitter, logger } from "../utils";

const emitter = Container.get(Emitter).getInstance();

export function setOffKeepAlive(_: Request, res: Response, next: NextFunction) {
  let isDisableKeepAlive = false;

  emitter.on("offKeepAlive", () => {
    isDisableKeepAlive = true;
    logger.info("Set off 'keep-alive' header");
  });

  if (isDisableKeepAlive) {
    res.set("Connection", "close");
  }
  next();
}
