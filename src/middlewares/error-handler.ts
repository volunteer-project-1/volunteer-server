import { MulterError } from "multer";
import colors from "colors";
import { Response, NextFunction, Request } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { HttpError } from "../lib";
import { logger } from "../utils";
import { HTTP_STATUS_CODE } from "../constants";

export function logMulterErrorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.log("err:", err);
  if (err instanceof MulterError) {
    logger.error(colors.blue(JSON.stringify(err)));
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ name: err.name, message: err.message });
  } else {
    next(err);
  }
}

export function logExErrorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpError) {
    logger.error(colors.blue(JSON.stringify(err)));
    res.status(err.status);
    res.json({ name: err.name, message: err.message, object: err.objects });
  } else {
    next(err);
  }
}

export function logDbErrorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof PrismaClientKnownRequestError) {
    logger.error(colors.blue(JSON.stringify(`${err.code}`)));

    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER);
    if (err.code === "P2002") {
      // return res.status(HTTP_STATUS_CODE.DUPLICATE);
      res.status(HTTP_STATUS_CODE.DUPLICATE);
      res.json({ message: `${err?.meta?.target} is Duplicate` });
      return;
    }

    if (err.code === "P2025" || err.code === "P2003") {
      res.status(HTTP_STATUS_CODE.NOT_FOUND);
    }
    res.json({ name: err.code, message: err.message });
  } else {
    next(err);
  }
}

export function logInternalServerErrorMiddleware(
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) {
  logger.error(colors.red(JSON.stringify(err)));
  res
    .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
    .json({ message: `SERVER_ERROR` });
}
