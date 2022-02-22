import type { NextFunction, Request, Response } from "express";
import { magenta } from "colors";
import onFinished from "on-finished";
import { logger } from "../utils";

export const loggingReq = (
  { method, originalUrl, query, body }: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(magenta(`STARTED [${method}] ${originalUrl}`));
  if (method === "GET" && query) {
    logger.info(`Query Parameters : ${JSON.stringify(query)}`);
  } else if (body) {
    Object.keys(body).forEach((k) => {
      if (k.toLocaleLowerCase().indexOf("password") > -1) {
        // eslint-disable-next-line no-param-reassign
        body.password = "FILTERED";
      }
    });
    logger.info(`Parameters : ${JSON.stringify(body)}`);
  }

  onFinished(res, (err) => {
    if (err) {
      logger.error(err);
    }
    logger.info(`FINISHED [${method}] ${originalUrl}`);
  });
  next();
};
