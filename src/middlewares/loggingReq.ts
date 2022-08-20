import type { NextFunction, Request, Response } from "express";
import { magenta } from "colors";
import onFinished from "on-finished";
import { logger } from "../utils";

const CENSOR_WORD_LIST = ["password", "passwordConfirm"] as const;
const lowerCaseCensorWordList = CENSOR_WORD_LIST.map((list) =>
  list.toLowerCase()
);

function xorArrFromBrr(arr: string[], brr: string[]) {
  return arr
    .map((key) => key.toLowerCase())
    .filter((key) => !brr.includes(key));
}

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
    logger.info(
      `Parameters : ${JSON.stringify(
        xorArrFromBrr(Object.keys({ ...body }), lowerCaseCensorWordList)
      )}`
    );
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
