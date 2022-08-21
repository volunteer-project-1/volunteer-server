import type { NextFunction, Request, Response } from "express";
import { magenta } from "colors";
import onFinished from "on-finished";
import { logger } from "../utils";

const CENSOR_WORD_LIST = ["password", "passwordConfirm"] as const;
const lowerCaseCensorWordList = CENSOR_WORD_LIST.map((list) =>
  list.toLowerCase()
);

type BodyWithIndexSignature = Record<string, string | unknown>;

function filteringNestedBody(
  body: BodyWithIndexSignature,
  censoredWords: string[]
) {
  const keys = Object.keys(body);
  // const filter1 = keys.filter( v => lowerCaseCensorWordList.indexOf(v.toLocaleLowerCase()) > -1);

  const keysOfObjectInBody = keys.filter((key) => body[key] instanceof Object);
  if (keysOfObjectInBody.length > 0) {
    for (const key of keysOfObjectInBody) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filteringNestedBody(body[key] as BodyWithIndexSignature, censoredWords);
    }
  }

  for (const word of censoredWords) {
    const key = keys.find((v) => v.toLocaleLowerCase() === word);
    if (key) {
      // eslint-disable-next-line no-param-reassign
      body[key] = "FILTERED";
    }
  }
  return body;
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
        filteringNestedBody({ ...body }, lowerCaseCensorWordList)
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
