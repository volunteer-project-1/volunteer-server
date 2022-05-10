import type { NextFunction, Request, Response } from "express";
import { magenta } from "colors";
import onFinished from "on-finished";
import { logger } from "../utils";

export const loggingReq = (
  { method, originalUrl, query, body, file, files }: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(magenta(`STARTED [${method}] ${originalUrl}`));
  if (method === "GET" && query) {
    logger.info(`Query Parameters : ${JSON.stringify(query)}`);
  }
  if (body) {
    const filteredBody = { ...body };
    Object.keys(body).forEach((k) => {
      if (k.toLocaleLowerCase().indexOf("password") > -1) {
        filteredBody.password = "FILTERED";
      }

      if (k.toLocaleLowerCase().indexOf("passwordconfirm") > -1) {
        filteredBody.passwordConfirm = "FILTERED";
      }
    });

    logger.info(`Parameters : ${JSON.stringify(filteredBody)}`);
  }
  if (file || files) {
    logger.info(`File : ${JSON.stringify(file || files)}`);
  }

  onFinished(res, (err) => {
    if (err) {
      logger.error(err);
    }
    logger.info(`FINISHED [${method}] ${originalUrl}`);
  });
  next();
};
