import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../lib";

export const isAuthenticate = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated() && req.user.type === "user") {
    next();
  } else {
    throw new UnauthorizedError("로그인 필요");
  }
};

export const isCompanyAuthenticate = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated() && req.user.type === "company") {
    next();
  } else {
    throw new UnauthorizedError("회사 계정만 접근 가능");
    // res.status(301).redirect(`${URL}/login`)
  }
};

export const isUnAuthenticate = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.isUnauthenticated()) {
    next();
  } else {
    throw new UnauthorizedError("로그인 한 유저는 접근 불가");
    // res.status(301).redirect(`${URL}/login`)
  }
};
