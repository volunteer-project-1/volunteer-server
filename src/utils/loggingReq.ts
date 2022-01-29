import { NextFunction, Request, Response } from "express";
import colors from "colors";
import onFinished from "on-finished";
import { logger } from ".";

const loggingReq = (req: Request, res: Response, next: NextFunction) => {
  logger.info(colors.magenta(`STARTED [${req.method}] ${req.originalUrl}`));
  if (req.method === "GET" && req.query) {
    logger.info(`Query Parameters : ${JSON.stringify(req.query)}`);
  } else if (req.body) {
    const printData = JSON.parse(JSON.stringify(req.body));
    Object.keys(printData).forEach((k) => {
      if (k.toLowerCase().indexOf("password") > -1) {
        printData[k] = "[FILTERED]";
      }
    });
    logger.info(`Parameters : ${JSON.stringify(printData)}`);
  }

  onFinished(res, (err) => {
    if (err) {
      logger.error(err);
    }
    logger.info(`FINISHED [${req.method}] ${req.originalUrl}`);
  });
  next();
};

export default loggingReq;
